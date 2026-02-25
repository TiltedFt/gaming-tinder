import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Markup } from 'telegraf';
import { BaseComponent } from '../../../common/base/base.component';
import { Language } from 'src/common/constants/supported-language';
import { Gender } from 'src/user/entities/user.entity';

export enum ProfileAction {
  EDIT_DESCRIPTION = 'profile_edit_description',
  EDIT_AGE = 'profile_edit_age',
  EDIT_GENDER = 'profile_edit_gender',
  EDIT_GAMES = 'profile_edit_games',
  EDIT_MIC = 'profile_edit_mic',
  EDIT_AVATAR = 'profile_edit_avatar',
  EDIT_COMMUNICATION = 'profile_edit_communication',
  GO_SEARCH = 'profile_go_search',
  GO_MAIN_MENU = 'profile_go_main_menu',
}

@Injectable()
export class ProfileGenderKeyboard extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(lang: Language) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_GENDER_MALE, lang),
          Gender.MALE,
        ),
      ],
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_GENDER_FEMALE, lang),
          Gender.FEMALE,
        ),
      ],
      [
        Markup.button.callback(
          this.t(I18nKey.PROFILE_GENDER_OTHER, lang),
          Gender.OTHER,
        ),
      ],
    ]);
  }
}
