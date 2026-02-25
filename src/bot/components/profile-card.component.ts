import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { User, Gender } from 'src/user/entities/user.entity';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Language } from 'src/common/constants/supported-language';
import { BaseComponent } from './base.component';

@Injectable()
export class ProfileCardComponent extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(user: User): string {
    const notSet = this.t(I18nKey.PROFILE_NOT_SET, user.language);

    const lines = [
      this.t(I18nKey.PROFILE_CARD_TITLE, user.language, {
        publicUsername: user.publicUsername,
      }),
      '',
      this.t(I18nKey.PROFILE_DESCRIPTION, user.language, {
        value: user.description ?? notSet,
      }),
      this.t(I18nKey.PROFILE_AGE, user.language, { value: user.age ?? notSet }),
      this.t(I18nKey.PROFILE_GENDER, user.language, {
        value: this.resolveGender(user.gender, user.language),
      }),
      this.t(I18nKey.PROFILE_GAMES, user.language, {
        value: this.resolveGames(user),
      }),
      this.t(I18nKey.PROFILE_HAS_MIC, user.language, {
        value: this.resolveMic(user.hasMic, user.language),
      }),
      this.t(I18nKey.PROFILE_COMMUNICATION, user.language, {
        value: user.preferredCommunicationWay ?? notSet,
      }),
    ];

    return lines.join('\n');
  }

  private resolveGender(gender: Gender, language: Language): string {
    const genderKeyMap: Record<Gender, I18nKey> = {
      [Gender.MALE]: I18nKey.PROFILE_GENDER_MALE,
      [Gender.FEMALE]: I18nKey.PROFILE_GENDER_FEMALE,
      [Gender.OTHER]: I18nKey.PROFILE_GENDER_OTHER,
    };

    return this.i18n.t(genderKeyMap[gender], { lang: language });
  }

  private resolveGames(user: User): string {
    if (!user.games?.length) {
      return this.i18n.t(I18nKey.PROFILE_NO_GAMES, { lang: user.language });
    }

    return user.games.map((g) => g.name).join(', ');
  }

  private resolveMic(hasMic: boolean, lang: Language): string {
    const key = hasMic ? I18nKey.PROFILE_MIC_YES : I18nKey.PROFILE_MIC_NO;
    return this.i18n.t(key, { lang });
  }
}
