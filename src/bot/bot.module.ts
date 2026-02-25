import { Module } from '@nestjs/common';
import { CommandHandlerModule } from './greeter/command-handler.module';
import { RegistrationSceneModule } from './registration-scene/registration-scene.module';
import { MainMenuSceneModule } from './main-menu-scene/main-menu-scene.module';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [
    CommandHandlerModule,
    RegistrationSceneModule,
    MainMenuSceneModule,
    ComponentsModule,
  ],
})
export class BotModule {}
