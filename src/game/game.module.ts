import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entity/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { GameSeedService } from './game-seed.service';
import { RawgClientService } from './rawg-client.service';
import { UserGameService } from './user-game.service';
import { I18nHelperModule } from 'src/common/helper/i18n-helper/i18n-helper.module';

@Module({
  controllers: [GameController],
  providers: [GameService, GameSeedService, RawgClientService, UserGameService],
  imports: [
    TypeOrmModule.forFeature([Game, User]),
    HttpModule,
  ],
  exports: [GameService, UserGameService],
})
export class GameModule {}
