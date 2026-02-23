export enum I18nKey {
  // greeter
  WELCOME_NEW_USER = 'greeter.welcome_new',

  // registration
  LANGUAGE_FOUND = 'registration.language_found',
  LANGUAGE_NOT_FOUND = 'registration.language_not_found',
  ASK_PUBLIC_USERNAME = 'registration.ask_public_username',
  REGISTRATION_SUCCESS = 'registration.success',

  // profile
  PROFILE_CARD_TITLE = 'profile.card_title',
  PROFILE_DESCRIPTION = 'profile.description',
  PROFILE_AGE = 'profile.age',
  PROFILE_GENDER = 'profile.gender',
  PROFILE_GAMES = 'profile.games',
  PROFILE_HAS_MIC = 'profile.has_mic',
  PROFILE_COMMUNICATION = 'profile.communication',
  PROFILE_NOT_SET = 'profile.not_set',
  PROFILE_NO_GAMES = 'profile.no_games',
  PROFILE_MIC_YES = 'profile.mic_yes',
  PROFILE_MIC_NO = 'profile.mic_no',
  PROFILE_GENDER_MALE = 'profile.gender_male',
  PROFILE_GENDER_FEMALE = 'profile.gender_female',
  PROFILE_GENDER_OTHER = 'profile.gender_other',
  PROFILE_ONBOARDING_MESSAGE = 'profile.onboarding_message',
  PROFILE_BTN_DESCRIPTION = 'profile.btn_description',
  PROFILE_BTN_AGE = 'profile.btn_age',
  PROFILE_BTN_GENDER = 'profile.btn_gender',
  PROFILE_BTN_GAMES = 'profile.btn_games',
  PROFILE_BTN_MIC = 'profile.btn_mic',
  PROFILE_BTN_COMMUNICATION = 'profile.btn_communication',
  PROFILE_BTN_SEARCH = 'profile.btn_search',
  PROFILE_BTN_MAIN_MENU = 'profile.btn_main_menu',

  // server-errors
  SOMETHING_WENT_WRONG = 'server-error.something_went_wrong',

  // user-error
  USERNAME_TAKEN = 'user-error.duplicate_publicUsername',
  ACCOUNT_EXISTS = 'user-error.duplicate_telegramId',
  INVALID_PUBLIC_USERNAME = 'user-error.invalid_public_username',
  PLEASE_USE_BUTTONS = 'user-error.please_use_buttons',
  TEXT_ONLY_PLEASE = 'user-error.text_only_please',
  SESSION_EXPIRED = 'user-error.session_expired',
}
