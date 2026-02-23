import { Module } from '@nestjs/common';
import { MainMenuSceneService } from './main-menu-scene.service';

@Module({
  providers: [MainMenuSceneService],
})
export class MainMenuSceneModule {}
