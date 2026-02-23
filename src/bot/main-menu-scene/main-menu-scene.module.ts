import { Module } from '@nestjs/common';
import { MainMenuSceneService } from './main-menu-scene.scene';

@Module({
  providers: [MainMenuSceneService],
})
export class MainMenuSceneModule {}
