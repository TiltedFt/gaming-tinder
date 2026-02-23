import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { User, Gender } from 'src/user/entities/user.entity';
import { I18nKey } from 'src/i18n/i18n-keys';

@Injectable()
export class ProfileCardComponent {
  constructor(private readonly i18n: I18nService) {}

  render(user: User, lang: string): string {
    const t = (key: string, args?: Record<string, unknown>) =>
      this.i18n.t(key, { lang, args });

    const notSet = t(I18nKey.PROFILE_NOT_SET);

    const lines = [
      t(I18nKey.PROFILE_CARD_TITLE, { publicUsername: user.publicUsername }),
      '',
      t(I18nKey.PROFILE_DESCRIPTION, { value: user.description ?? notSet }),
      t(I18nKey.PROFILE_AGE, { value: user.age ?? notSet }),
      t(I18nKey.PROFILE_GENDER, {
        value: this.resolveGender(user.gender, lang),
      }),
      t(I18nKey.PROFILE_GAMES, { value: this.resolveGames(user, lang) }),
      t(I18nKey.PROFILE_HAS_MIC, { value: this.resolveMic(user.hasMic, lang) }),
      t(I18nKey.PROFILE_COMMUNICATION, {
        value: user.preferredCommunicationWay ?? notSet,
      }),
    ];

    return lines.join('\n');
  }

  private resolveGender(gender: Gender, lang: string): string {
    const genderKeyMap: Record<Gender, I18nKey> = {
      [Gender.MALE]: I18nKey.PROFILE_GENDER_MALE,
      [Gender.FEMALE]: I18nKey.PROFILE_GENDER_FEMALE,
      [Gender.OTHER]: I18nKey.PROFILE_GENDER_OTHER,
    };

    return this.i18n.t(genderKeyMap[gender], { lang });
  }

  private resolveGames(user: User, lang: string): string {
    if (!user.games?.length) {
      return this.i18n.t(I18nKey.PROFILE_NO_GAMES, { lang });
    }

    return user.games.map((g) => g.name).join(', ');
  }

  private resolveMic(hasMic: boolean, lang: string): string {
    const key = hasMic ? I18nKey.PROFILE_MIC_YES : I18nKey.PROFILE_MIC_NO;
    return this.i18n.t(key, { lang });
  }
}
