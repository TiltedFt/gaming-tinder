import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Markup } from 'telegraf';
import { BaseComponent } from '../../../common/base/base.component';
import { Language } from 'src/common/constants/supported-language';
import { Gender } from 'src/user/entities/user.entity';

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
