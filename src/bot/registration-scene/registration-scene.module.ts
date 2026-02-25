import { Module } from '@nestjs/common';
import { RegistrationScene } from './registration-scene.wizard';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { LanguageKeyboardComponent } from './components/language-keyboard.component';

@Module({
  providers: [RegistrationScene, LanguageKeyboardComponent],
  imports: [UserModule],
})
export class RegistrationSceneModule {}
