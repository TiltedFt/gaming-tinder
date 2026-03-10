import { Module } from '@nestjs/common';
import { ProfileSceneService } from './profile-scene.service';
import { ProfileCardComponent } from './components/profile-card.component';
import { ProfileKeyboardComponent } from './components/profile-keyboard.component';
import { UserModule } from 'src/user/user.module';
import { ProfileGenderKeyboard } from './components/profile-gender-keyboard.component';
import { LanguageService } from 'src/language/language.service';
import { LanguageModule } from 'src/language/language.module';
import { UserSpokenLanguagesKeyboard } from './components/user-spoken-languages.component';

@Module({
  providers: [
    ProfileSceneService,
    ProfileCardComponent,
    ProfileKeyboardComponent,
    ProfileGenderKeyboard,
    UserSpokenLanguagesKeyboard
  ],
  imports: [UserModule, LanguageModule],
})
export class ProfileSceneModule {}
