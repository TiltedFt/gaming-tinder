import { Injectable } from '@nestjs/common';
import { Language } from 'src/language/entities/language.entity';
import { Markup } from 'telegraf';

@Injectable()
export class LanguageKeyboardComponent {
  render(languages: Language[]) {
    const buttons = languages.map((lang) => [
      Markup.button.callback(lang.code, `lang_${lang.code}`),
    ]);
    return Markup.inlineKeyboard(buttons);
  }
}
