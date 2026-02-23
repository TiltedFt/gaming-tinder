import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Markup } from 'telegraf';

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
export class ProfileKeyboardComponent {
  constructor(private readonly i18n: I18nService) {}

  render(lang: string) {
    const t = (key: string, args?: Record<string, unknown>): string =>
      this.i18n.t(key, { lang, args }) as string;

    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_DESCRIPTION),
          ProfileAction.EDIT_DESCRIPTION,
        ),
      ],
      [
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_AGE),
          ProfileAction.EDIT_AGE,
        ),
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_GENDER),
          ProfileAction.EDIT_GENDER,
        ),
      ],
      [
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_GAMES),
          ProfileAction.EDIT_GAMES,
        ),
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_MIC),
          ProfileAction.EDIT_MIC,
        ),
      ],
      [
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_COMMUNICATION),
          ProfileAction.EDIT_COMMUNICATION,
        ),
      ],
      [
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_SEARCH),
          ProfileAction.GO_SEARCH,
        ),
        Markup.button.callback(
          t(I18nKey.PROFILE_BTN_MAIN_MENU),
          ProfileAction.GO_MAIN_MENU,
        ),
      ],
    ]);
  }
}
