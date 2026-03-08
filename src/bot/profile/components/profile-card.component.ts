import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { User, Gender } from 'src/user/entities/user.entity';
import { I18nKey } from 'src/i18n/i18n-keys';

import { BaseComponent } from '../../../common/base/base.component';

@Injectable()
export class ProfileCardComponent extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(user: User): string {
    const notSet = this.t(I18nKey.PROFILE_NOT_SET, user.getBotLanguageCode);

    const lines = [
      this.t(I18nKey.PROFILE_CARD_TITLE, user.getBotLanguageCode, {
        publicUsername: user.publicUsername,
      }),
      '',
      this.t(I18nKey.PROFILE_DESCRIPTION, user.getBotLanguageCode, {
        value: user.description ?? notSet,
      }),
      this.t(I18nKey.PROFILE_AGE, user.getBotLanguageCode, {
        value: user.age ?? notSet,
      }),
      this.t(I18nKey.PROFILE_GENDER, user.getBotLanguageCode, {
        value: this.resolveGender(user.gender, user.getBotLanguageCode),
      }),
      this.t(I18nKey.PROFILE_GAMES, user.getBotLanguageCode, {
        value: this.resolveGames(user),
      }),
      this.t(I18nKey.PROFILE_HAS_MIC, user.getBotLanguageCode, {
        value: this.resolveMic(user.hasMic, user.getBotLanguageCode),
      }),
      this.t(I18nKey.PROFILE_COMMUNICATION, user.getBotLanguageCode, {
        value: user.preferredCommunicationWay ?? notSet,
      }),
    ];

    return lines.join('\n');
  }

  private resolveGender(gender: Gender, botLanguage: string): string {
    const genderKeyMap: Record<Gender, I18nKey> = {
      [Gender.MALE]: I18nKey.PROFILE_GENDER_MALE,
      [Gender.FEMALE]: I18nKey.PROFILE_GENDER_FEMALE,
      [Gender.OTHER]: I18nKey.PROFILE_GENDER_OTHER,
    };

    return this.i18n.t(genderKeyMap[gender], { lang: botLanguage });
  }

  private resolveGames(user: User): string {
    if (!user.games?.length) {
      return this.t(I18nKey.PROFILE_NO_GAMES, user.getBotLanguageCode);
    }

    return user.games.map((g) => g.name).join(', ');
  }

  private resolveMic(hasMic: boolean, lang: string): string {
    const key = hasMic ? I18nKey.PROFILE_MIC_YES : I18nKey.PROFILE_MIC_NO;
    return this.t(key, lang);
  }
}
