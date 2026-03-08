import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Markup } from 'telegraf';
import { BaseComponent } from 'src/common/base/base.component';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Game } from 'src/game/entity/game.entity';
import { GameEditorAction, REMOVE_PREFIX } from '../game-editor.constants';

@Injectable()
export class GameListKeyboard extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(games: Game[], lang: string, page: number, totalPages: number) {
    const buttons: ReturnType<typeof Markup.button.callback>[][] = [];

    // game rows with remove button
    for (const game of games) {
      buttons.push([
        Markup.button.callback(`❌ ${game.name}`, `${REMOVE_PREFIX}${game.id}`),
      ]);
    }

    // pagination
    if (totalPages > 1) {
      const paginationRow: ReturnType<typeof Markup.button.callback>[] = [];

      if (page > 1) {
        paginationRow.push(
          Markup.button.callback(
            this.t(I18nKey.GAMES_BTN_PREV_PAGE, lang),
            GameEditorAction.PREV_PAGE,
          ),
        );
      }

      paginationRow.push(
        Markup.button.callback(
          this.t(I18nKey.GAMES_PAGE_INDICATOR, lang, { page, totalPages }),
          'noop',
        ),
      );

      if (page < totalPages) {
        paginationRow.push(
          Markup.button.callback(
            this.t(I18nKey.GAMES_BTN_NEXT_PAGE, lang),
            GameEditorAction.NEXT_PAGE,
          ),
        );
      }

      buttons.push(paginationRow);
    }

    buttons.push([
      Markup.button.callback(
        this.t(I18nKey.GAMES_BTN_ADD, lang),
        GameEditorAction.ADD_GAME,
      ),
    ]);

    buttons.push([
      Markup.button.callback(
        this.t(I18nKey.GAMES_BTN_BACK_TO_PROFILE, lang),
        GameEditorAction.BACK_TO_PROFILE,
      ),
    ]);

    return Markup.inlineKeyboard(buttons);
  }
}
