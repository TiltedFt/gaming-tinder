import { Module } from '@nestjs/common';
import { MainMenuSceneService } from './main-menu-scene.service';
import { MainMenuSceneController } from './main-menu-scene.controller';

@Module({
  controllers: [MainMenuSceneController],
  providers: [MainMenuSceneService],
})
export class MainMenuSceneModule {}
