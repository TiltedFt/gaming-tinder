import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Game } from './entity/game.entity';
import { User } from 'src/user/entities/user.entity';
import { RawgClientService } from './rawg-client.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rawgClient: RawgClientService,
  ) {}

  private fetchedQueries = new Set<string>();

  // ufffffffffff idk, just a chill coder
  async searchLocal(query: string, limit = 5): Promise<Game[]> {
    return this.gameRepository
      .createQueryBuilder('game')
      .where('similarity(game.name, :query) > 0.3 OR game.name ILIKE :like', {
        query,
        like: `%${query}%`,
      })
      .orderBy(`CASE WHEN game.name ILIKE :startsWith THEN 0 ELSE 1 END`, 'ASC')
      .addOrderBy('similarity(game.name, :query)', 'DESC')
      .setParameter('startsWith', `${query}%`)
      .take(limit)
      .getMany();
  }

  async fetchAndSaveFromApi(query: string, limit = 5): Promise<void> {
    const apiGames = await this.rawgClient.searchGames(query, limit);
    for (const g of apiGames) {
      await this.gameRepository.upsert(
        { rawgId: g.rawgId, name: g.name, coverUrl: g.coverUrl },
        ['rawgId'],
      );
    }
  }

  async search(query: string, limit = 5): Promise<Game[]> {
    const cacheKey = query.toLowerCase().trim();

    if (!this.fetchedQueries.has(cacheKey)) {
      await this.fetchAndSaveFromApi(query, limit);
      this.fetchedQueries.add(cacheKey);
    }

    return this.searchLocal(query, limit);
  }

  private async getBestSimilarity(query: string): Promise<number> {
    const result = await this.gameRepository
      .createQueryBuilder('game')
      .select('MAX(similarity(game.name, :query))', 'best')
      .setParameter('query', query)
      .getRawOne();

    return parseFloat(result?.best ?? '0');
  }

  async findByIds(ids: string[]): Promise<Game[]> {
    if (!ids.length) return [];
    return this.gameRepository.find({ where: { id: In(ids) } });
  }

  async getUserGames(userId: string): Promise<Game[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['games'],
    });
    return user?.games ?? [];
  }

  async getUserGamesPaginated(
    userId: string,
    page: number,
    pageSize = 10,
  ): Promise<{ games: Game[]; total: number; totalPages: number }> {
    const allGames = await this.getUserGames(userId);
    const total = allGames.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (page - 1) * pageSize;
    const games = allGames.slice(start, start + pageSize);

    return { games, total, totalPages };
  }

  async addGameToUser(userId: string, gameId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['games'],
    });
    if (!user) return false;

    const game = await this.gameRepository.findOneBy({ id: gameId });
    if (!game) return false;

    if (user.games.some((g) => g.id === gameId)) return false;

    user.games.push(game);
    await this.userRepository.save(user);
    return true;
  }

  async removeGameFromUser(userId: string, gameId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['games'],
    });
    if (!user) return false;

    const before = user.games.length;
    user.games = user.games.filter((g) => g.id !== gameId);
    if (user.games.length === before) return false;

    await this.userRepository.save(user);
    return true;
  }
}
