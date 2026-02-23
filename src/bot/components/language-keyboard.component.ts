import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { SUPPORTED_LANGUAGES } from 'src/common/constants/app-constants';

@Injectable()
export class LanguageKeyboardComponent {
  render() {
    const buttons = SUPPORTED_LANGUAGES.map((lang) => [
      Markup.button.callback(lang.label, `lang_${lang.code}`),
    ]);
    return Markup.inlineKeyboard(buttons);
  }
}