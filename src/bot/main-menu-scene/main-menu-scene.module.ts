import { Module } from '@nestjs/common';
import { MainMenuSceneService } from './main-menu-scene.scene';
import { ComponentsModule } from '../components/components.module';

@Module({
  providers: [MainMenuSceneService],
  imports: [ComponentsModule],
})
export class MainMenuSceneModule {}
