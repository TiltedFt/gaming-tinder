import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entity/game.entity';
import seedData from './data/games-seed.json';

// relative pathsrc/game/data/games-seed.json

interface SeedGame {
  rawgId: number;
  name: string;
  coverUrl: string | null;
}

@Injectable()
export class GameSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async onModuleInit() {
    const count = await this.gameRepository.count();

    if (count > 0) {
      return;
    }

    await this.seed();
  }

  private async seed() {
    const games = seedData as SeedGame[];

    if (!games.length) {
      return;
    }

    const chunkSize = 100;
    for (let i = 0; i < games.length; i += chunkSize) {
      const chunk = games.slice(i, i + chunkSize);

      await this.gameRepository.upsert(
        chunk.map((g) => ({
          rawgId: g.rawgId,
          name: g.name,
          coverUrl: g.coverUrl,
        })),
        ['rawgId'],
      );
    }
  }
}
