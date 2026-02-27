import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entity/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { GameSeedService } from './game-seed.service';
import { RawgClientService } from './rawg-client.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameSeedService, RawgClientService],
  imports: [TypeOrmModule.forFeature([Game, User]), HttpModule],
  exports: [GameService],
})
export class GameModule {}
