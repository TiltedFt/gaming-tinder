import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BaseComponent } from '../../../common/base/base.component';
import { Language } from 'src/language/entities/language.entity';
import { ProfileKey } from 'src/i18n/i18n-keys';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserSpokenLanguagesKeyboard extends BaseComponent {
  constructor(i18n: I18nService) {
    super(i18n);
  }

  render(languages: Language[], selectedIds: string[], lang: string) {
    const buttons = languages.map((language) => {
      const isSelected = selectedIds.includes(language.id);
      const label = isSelected
        ? `${language.nativeName} ✅`
        : language.nativeName;
      return [Markup.button.callback(label, `spokenlang_${language.id}`)];
    });

    buttons.push([
      Markup.button.callback(
        this.t(ProfileKey.SPOKEN_LANGUAGES_SAVED, lang),
        'spokenlang_done',
      ),
    ]);

    return Markup.inlineKeyboard(buttons);
  }
}
