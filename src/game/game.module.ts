import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game, GamingPlatform } from './entity/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [TypeOrmModule.forFeature([Game, GamingPlatform])],
})
export class GameModule {}
