import { Language } from './supported-language';

export const UPDATE_PROFILE_WIZARD_SCENE = 'update_profile_wizard';
export const REGISTRATION_WIZARD_SCENE = 'registration_wizard_scene';
export const MAIN_MENU_SCENE = 'main_menu_scene';
export const PROFILE_SCENE = 'profile_scene';
export const GAME_EDITOR_SCENE = 'game_editor_scene';

export const SUPPORTED_LANGUAGES = [
  { code: Language.ENGLISH, label: '🇬🇧 English' },
  { code: Language.RUSSIAN, label: '🇷🇺 Русский' },
] as const;

export enum BotCommand {
  START = 'start',
  MENU = 'menu',
  HELP = 'help',
  PROFILE = 'profile',
  SEARCH = 'search',
}

export enum ProfileEditMethods {
  DESCRIPTION = 'description',
  AVATAR = 'avatar',
  AGE = 'age',
  GENDER = 'gender',
  GAMES = 'games',
  MICROPHONE = 'microphone',
  COMMUNICATION = 'communication',
}
