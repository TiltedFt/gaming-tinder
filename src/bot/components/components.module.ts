import { Module } from '@nestjs/common';
import { ProfileCardComponent } from './profile-card.component';
import { ProfileKeyboardComponent } from './profile-leyboard.component';
import { LanguageKeyboardComponent } from './language-keyboard.component';

@Module({
  providers: [
    ProfileCardComponent,
    ProfileKeyboardComponent,
    LanguageKeyboardComponent,
  ],
  exports: [
    ProfileCardComponent,
    ProfileKeyboardComponent,
    LanguageKeyboardComponent,
  ],
})
export class ComponentsModule {}
