import { Module } from '@nestjs/common';
import { RegistrationScene} from './registration-scene.wizard';

@Module({
  providers: [RegistrationScene],
})
export class RegistrationSceneModule {}
