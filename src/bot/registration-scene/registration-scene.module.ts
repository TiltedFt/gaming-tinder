import { Module } from '@nestjs/common';
import { RegistrationScene } from './registration-scene.wizard';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ProfileService } from 'src/user/profile/profile.service';
import { ComponentsModule } from '../components/components.module';

@Module({
  providers: [RegistrationScene, ProfileService],
  imports: [UserModule, ComponentsModule],
})
export class RegistrationSceneModule {}
