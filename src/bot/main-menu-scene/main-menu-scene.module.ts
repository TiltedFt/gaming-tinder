import { Module } from '@nestjs/common';
import { MainMenuSceneService } from './main-menu-scene.service';
import { MainMenuComponent } from './components/main-menu.component';

@Module({
  providers: [MainMenuSceneService, MainMenuComponent],
  exports: [MainMenuComponent],
})
export class MainMenuSceneModule {}

/* @Module({
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
 */
