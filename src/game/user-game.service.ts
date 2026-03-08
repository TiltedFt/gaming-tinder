import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Game } from './entity/game.entity';
import { GameService } from './game.service';

@Injectable()
export class UserGameService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly gameService: GameService,
  ) {}

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

    const game = await this.gameService.findById(gameId);
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
