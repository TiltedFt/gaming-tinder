export enum I18nKey {
  // greeter
  WELCOME_NEW_USER = 'greeter.welcome_new',

  // registration
  LANGUAGE_FOUND = 'registration.language_found',
  LANGUAGE_NOT_FOUND = 'registration.language_not_found',
  ASK_PUBLIC_USERNAME = 'registration.ask_public_username',
  INVALID_PUBLIC_USERNAME = 'registration.invalid_public_username',
  REGISTRATION_SUCCESS = 'registration.success',

  // errors
  SOMETHING_WENT_WRONG = 'errors.something_went_wrong',
  USERNAME_TAKEN = 'errors.duplicate_publicUsername',
  ACCOUNT_EXISTS = 'errors.duplicate_telegramId',
}
