import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { BaseComponent } from '../../../common/base/base.component';
import { Language } from 'src/language/entities/language.entity';

@Injectable()
export class UserSpokenLanguagesKeyboard extends BaseComponent {
  render(languages: Language[], selectedIds: string[]) {
    const buttons = languages.map((lang) => {
      const isSelected = selectedIds.includes(lang.id);
      const label = isSelected ? `✅ ${lang.nativeName}` : lang.nativeName;
      return [Markup.button.callback(label, `spokenlang_${lang.id}`)];
    });

    buttons.push([Markup.button.callback('✔️ Готово', 'spokenlang_done')]);

    return Markup.inlineKeyboard(buttons);
  }
}
