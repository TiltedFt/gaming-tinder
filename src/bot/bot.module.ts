import { Module } from '@nestjs/common';
import { CommandHandlerModule } from './command-handler/command-handler.module';
import { RegistrationSceneModule } from './registration-scene/registration-scene.module';
import { MainMenuSceneModule } from './main-menu-scene/main-menu-scene.module';
import { UserModule } from 'src/user/user.module';
import { ProfileSceneModule } from './profile/profile-scene.module';

@Module({
  imports: [
    UserModule,
    CommandHandlerModule,
    RegistrationSceneModule,
    MainMenuSceneModule,
    ProfileSceneModule,
  ],
})
export class BotModule {}
