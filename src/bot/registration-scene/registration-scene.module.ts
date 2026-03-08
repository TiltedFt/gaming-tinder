import { Module } from '@nestjs/common';
import { RegistrationScene } from './registration-scene.wizard';
import { UserModule } from 'src/user/user.module';
import { LanguageKeyboardComponent } from './components/language-keyboard.component';
import { LanguageModule } from 'src/language/language.module';

@Module({
  providers: [RegistrationScene, LanguageKeyboardComponent],
  imports: [UserModule, LanguageModule],
})
export class RegistrationSceneModule {}
