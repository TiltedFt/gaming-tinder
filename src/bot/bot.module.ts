import { Module } from '@nestjs/common';
import { GreeterModule } from './greeter/greeter.module';
import { RegistrationSceneModule } from './registration-scene/registration-scene.module';
import { MainMenuSceneModule } from './main-menu-scene/main-menu-scene.module';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [
    GreeterModule,
    RegistrationSceneModule,
    MainMenuSceneModule,
    ComponentsModule,
  ],
})
export class BotModule {}
