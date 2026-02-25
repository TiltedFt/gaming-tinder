import { Module } from '@nestjs/common';
import { ProfileCardComponent } from './profile-card.component';
import { ProfileKeyboardComponent } from './profile-leyboard.component';
import { LanguageKeyboardComponent } from './language-keyboard.component';
import { MainMenuComponent } from './main-menu.component';

@Module({
  providers: [
    ProfileCardComponent,
    ProfileKeyboardComponent,
    LanguageKeyboardComponent,
    MainMenuComponent,
  ],
  exports: [
    ProfileCardComponent,
    ProfileKeyboardComponent,
    LanguageKeyboardComponent,
    MainMenuComponent,
  ],
})
export class ComponentsModule {}
