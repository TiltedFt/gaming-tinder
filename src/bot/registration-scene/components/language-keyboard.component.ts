import { Markup } from 'telegraf';
import { SUPPORTED_LANGUAGES } from 'src/common/constants/app-constants';

export function languageKeyboard() {
    const buttons = SUPPORTED_LANGUAGES.map((lang) => [
        Markup.button.callback(lang.label, `lang_${lang.code}`),
    ]);
    return Markup.inlineKeyboard(buttons);
}
