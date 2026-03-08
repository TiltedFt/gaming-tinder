import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseComponent } from '../../../common/base/base.component';
import { Markup } from 'telegraf';
import { MainMenuKey } from 'src/i18n/i18n-keys';

export enum MenuAction {
  GO_TO_PROFILE = 'go_to_profile',
  START_TO_SEARCH = 'start_to_search',
}

@Injectable()
export class MainMenuComponent extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(lang: string) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.t(MainMenuKey.SHOW_MY_PROFILE, lang),
          MenuAction.GO_TO_PROFILE,
        ),
        Markup.button.callback(
          this.t(MainMenuKey.START_SEARCHING, lang),
          MenuAction.START_TO_SEARCH,
        ),
      ],
    ]);
  }
}
