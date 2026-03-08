import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Markup } from 'telegraf';
import { BaseComponent } from '../../../common/base/base.component';
import { ProfileKey } from 'src/i18n/i18n-keys';

export enum ProfileAction {
  EDIT_DESCRIPTION = 'profile_edit_description',
  EDIT_AGE = 'profile_edit_age',
  EDIT_GENDER = 'profile_edit_gender',
  EDIT_GAMES = 'profile_edit_games',
  EDIT_MIC = 'profile_edit_mic',
  EDIT_AVATAR = 'profile_edit_avatar',
  EDIT_COMMUNICATION = 'profile_edit_communication',
  GO_MAIN_MENU = 'profile_go_main_menu',
}

@Injectable()
export class ProfileKeyboardComponent extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(lang: string, hasMic: boolean) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.t(ProfileKey.BTN_DESCRIPTION, lang),
          ProfileAction.EDIT_DESCRIPTION,
        ),
        Markup.button.callback(
          this.t(ProfileKey.BTN_AVATAR, lang),
          ProfileAction.EDIT_AVATAR,
        ),
      ],
      [
        Markup.button.callback(
          this.t(ProfileKey.BTN_AGE, lang),
          ProfileAction.EDIT_AGE,
        ),
        Markup.button.callback(
          this.t(ProfileKey.BTN_GENDER, lang),
          ProfileAction.EDIT_GENDER,
        ),
      ],
      [
        Markup.button.callback(
          this.t(ProfileKey.BTN_GAMES, lang),
          ProfileAction.EDIT_GAMES,
        ),
        Markup.button.callback(
          this.t(ProfileKey.BTN_MIC, lang, {
            value: hasMic ? '✅' : '❌',
          }),
          ProfileAction.EDIT_MIC,
        ),
      ],
      [
        Markup.button.callback(
          this.t(ProfileKey.BTN_COMMUNICATION, lang),
          ProfileAction.EDIT_COMMUNICATION,
        ),
      ],
      [
        Markup.button.callback(
          this.t(ProfileKey.BTN_MAIN_MENU, lang),
          ProfileAction.GO_MAIN_MENU,
        ),
      ],
    ]);
  }
}
