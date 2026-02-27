import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Markup } from 'telegraf';
import { BaseComponent } from 'src/common/base/base.component';
import { Language } from 'src/common/constants/supported-language';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Game } from 'src/game/entity/game.entity';
import { ADD_RESULT_PREFIX, GameEditorAction } from '../game-editor.constants';

@Injectable()
export class GameSearchResultsKeyboard extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(results: Game[], userGameIds: Set<string>, lang: Language) {
    const buttons: ReturnType<typeof Markup.button.callback>[][] = [];

    for (const game of results) {
      const alreadyAdded = userGameIds.has(game.id);
      const label = alreadyAdded ? `✅ ${game.name}` : `➕ ${game.name}`;
      const action = alreadyAdded ? 'noop' : `${ADD_RESULT_PREFIX}${game.id}`;
      buttons.push([Markup.button.callback(label, action)]);
    }

    buttons.push([
      Markup.button.callback(
        this.t(I18nKey.GAMES_BTN_SEARCH_AGAIN, lang),
        GameEditorAction.SEARCH_AGAIN,
      ),
    ]);

    buttons.push([
      Markup.button.callback(
        this.t(I18nKey.GAMES_BTN_EXPAND_SEARCH, lang),
        GameEditorAction.EXPAND_SEARCH,
      ),
    ]);

    buttons.push([
      Markup.button.callback(
        this.t(I18nKey.GAMES_BTN_BACK_TO_LIST, lang),
        GameEditorAction.BACK_TO_LIST,
      ),
    ]);

    return Markup.inlineKeyboard(buttons);
  }
}
