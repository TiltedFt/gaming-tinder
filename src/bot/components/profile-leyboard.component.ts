import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Markup } from 'telegraf';
import { BaseComponent } from './base.component';
import { Language } from 'src/common/constants/supported-language';

export enum ProfileAction {
  EDIT_DESCRIPTION = 'profile_edit_description',
  EDIT_AGE = 'profile_edit_age',
  EDIT_GENDER = 'profile_edit_gender',
  EDIT_GAMES = 'profile_edit_games',
  EDIT_MIC = 'profile_edit_mic',
  EDIT_COMMUNICATION = 'profile_edit_communication',
  GO_SEARCH = 'profile_go_search',
  GO_MAIN_MENU = 'profile_go_main_menu',
}

@Injectable()
export class ProfileKeyboardComponent extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(lang: Language) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_DESCRIPTION, lang),
          ProfileAction.EDIT_DESCRIPTION,
        ),
      ],
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_AGE, lang),
          ProfileAction.EDIT_AGE,
        ),
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_GENDER, lang),
          ProfileAction.EDIT_GENDER,
        ),
      ],
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_GAMES, lang),
          ProfileAction.EDIT_GAMES,
        ),
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_MIC, lang),
          ProfileAction.EDIT_MIC,
        ),
      ],
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_COMMUNICATION, lang),
          ProfileAction.EDIT_COMMUNICATION,
        ),
      ],
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_SEARCH, lang),
          ProfileAction.GO_SEARCH,
        ),
        Markup.button.callback(
          this.t(I18nKey.PROFILE_BTN_MAIN_MENU, lang),
          ProfileAction.GO_MAIN_MENU,
        ),
      ],
    ]);
  }
}
