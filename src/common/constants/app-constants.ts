import { Language } from './supported-language';

export const GREETER_WIZARD_SCENE = 'greeter_wizard';
export const UPDATE_PROFILE_WIZARD_SCENE = 'update_profile_wizard';
export const REGISTRATION_WIZARD_SCENE = 'registration_wizard_scene';
export const MAIN_MENU_SCENE = 'main_menu_scene';

export const SUPPORTED_LANGUAGES = [
  { code: Language.ENGLISH, label: '🇬🇧 English' },
  { code: Language.RUSSIAN, label: '🇷🇺 Русский' },
] as const;

export enum BotCommand {
  START = '/start',
}
