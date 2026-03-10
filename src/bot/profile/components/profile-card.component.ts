import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { User, Gender } from 'src/user/entities/user.entity';

import { BaseComponent } from '../../../common/base/base.component';
import { ProfileKey } from 'src/i18n/i18n-keys';

@Injectable()
export class ProfileCardComponent extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(user: User): string {
    const notSet = this.t(ProfileKey.NOT_SET, user.getBotLanguageCode);

    const lines = [
      this.t(ProfileKey.CARD_TITLE, user.getBotLanguageCode, {
        publicUsername: user.publicUsername,
      }),
      '',
      this.t(ProfileKey.DESCRIPTION, user.getBotLanguageCode, {
        value: user.description ?? notSet,
      }),
      this.t(ProfileKey.AGE, user.getBotLanguageCode, {
        value: user.age ?? notSet,
      }),
      this.t(ProfileKey.GENDER, user.getBotLanguageCode, {
        value: this.resolveGender(user.gender, user.getBotLanguageCode),
      }),
      this.t(ProfileKey.GAMES, user.getBotLanguageCode, {
        value: this.resolveGames(user),
      }),
      this.t(ProfileKey.SPOKEN_LANGUAGES_DISPLAY, user.getBotLanguageCode, {
        value: this.resolveSpokenLanguages(user),
      }),
      this.t(ProfileKey.HAS_MIC, user.getBotLanguageCode, {
        value: this.resolveMic(user.hasMic, user.getBotLanguageCode),
      }),
      this.t(ProfileKey.COMMUNICATION, user.getBotLanguageCode, {
        value: user.preferredCommunicationWay ?? notSet,
      }),
    ];

    return lines.join('\n');
  }

  private resolveSpokenLanguages(user: User): string {
    if (!user.spokenLanguages?.length) {
      return this.t(ProfileKey.NO_SPOKEN_LANGUAGES, user.getBotLanguageCode);
    }
    return user.spokenLanguages.map((l) => l.nativeName).join(', ');
  }

  private resolveGender(gender: Gender, botLanguage: string): string {
    const genderKeyMap: Record<Gender, ProfileKey> = {
      [Gender.MALE]: ProfileKey.GENDER_MALE,
      [Gender.FEMALE]: ProfileKey.GENDER_FEMALE,
      [Gender.OTHER]: ProfileKey.GENDER_OTHER,
    };

    return this.i18n.t(genderKeyMap[gender], { lang: botLanguage });
  }

  private resolveGames(user: User): string {
    if (!user.games?.length) {
      return this.t(ProfileKey.NO_GAMES, user.getBotLanguageCode);
    }

    return user.games.map((g) => g.name).join(', ');
  }

  private resolveMic(hasMic: boolean, lang: string): string {
    const key = hasMic ? ProfileKey.MIC_YES : ProfileKey.MIC_NO;
    return this.t(key, lang);
  }
}
