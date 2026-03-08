import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Markup } from 'telegraf';
import { BaseComponent } from '../../../common/base/base.component';
import { Gender } from 'src/user/entities/user.entity';
import { ProfileKey } from 'src/i18n/i18n-keys';

@Injectable()
export class ProfileGenderKeyboard extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(lang: string) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.t(ProfileKey.GENDER_MALE, lang),
          Gender.MALE,
        ),
      ],
      [
        Markup.button.callback(
          this.t(ProfileKey.GENDER_FEMALE, lang),
          Gender.FEMALE,
        ),
      ],
      [
        Markup.button.callback(
          this.t(ProfileKey.GENDER_OTHER, lang),
          Gender.OTHER,
        ),
      ],
    ]);
  }
}
