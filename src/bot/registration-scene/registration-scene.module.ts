import { Module } from '@nestjs/common';
import { RegistrationScene } from './registration-scene.wizard';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ProfileService } from 'src/user/profile/profile.service';

@Module({
  providers: [RegistrationScene, ProfileService],
  imports: [UserModule],
})
export class RegistrationSceneModule {}
