import { Module } from "@nestjs/common";
import { GreeterModule } from "./greeter/greeter.module";
import { RegistrationSceneModule } from './registration-scene/registration-scene.module';
import { MainMenuSceneModule } from './main-menu-scene/main-menu-scene.module';

@Module({
  imports: [GreeterModule, RegistrationSceneModule, MainMenuSceneModule],
})
export class BotModule {}