import { Module } from '@nestjs/common';
import { GameListKeyboard } from './components/game-list-keyboard.component';
import { GameSearchResultsKeyboard } from './components/game-search-results-keyboard.component';
import { GameModule } from 'src/game/game.module';
import { GameEditorSceneService } from './game-editor.scene.service';

@Module({
  imports: [GameModule],
  providers: [
    GameEditorSceneService,
    GameListKeyboard,
    GameSearchResultsKeyboard,
  ],
})
export class GameEditorSceneModule {}
