import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Game } from './entity/game.entity';
import { RawgClientService } from './rawg-client.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly rawgClient: RawgClientService,
  ) {}

  private fetchedQueries = new Set<string>();

  async searchLocal(query: string, limit = 5): Promise<Game[]> {
    const sanitized = query.replace(/[%_]/g, '\\$&');

    return this.gameRepository
      .createQueryBuilder('game')
      .where('similarity(game.name, :query) > 0.3 OR game.name ILIKE :like', {
        query: sanitized,
        like: `%${sanitized}%`,
      })
      .orderBy(`CASE WHEN game.name ILIKE :startsWith THEN 0 ELSE 1 END`, 'ASC')
      .addOrderBy('similarity(game.name, :query)', 'DESC')
      .setParameter('startsWith', `${sanitized}%`)
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

  async findByIds(ids: string[]): Promise<Game[]> {
    if (!ids.length) return [];
    return this.gameRepository.find({ where: { id: In(ids) } });
  }

  async findById(id: string): Promise<Game | null> {
    return this.gameRepository.findOneBy({ id });
  }
}
