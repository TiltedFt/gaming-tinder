export enum I18nKey {
  // greeter
  WELCOME_NEW_USER = 'greeter.welcome_new',

  // registration
  LANGUAGE_FOUND = 'registration.language_found',
  LANGUAGE_NOT_FOUND = 'registration.language_not_found',
  ASK_PUBLIC_USERNAME = 'registration.ask_public_username',

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
