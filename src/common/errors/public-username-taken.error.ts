import { I18nKey } from 'src/i18n/i18n-keys';
import { BotError } from './bot-error';

export class PublicUsernameTakenError extends BotError {
  readonly i18nKey = I18nKey.USERNAME_TAKEN;

  constructor(username: string) {
    super(`Username "${username}" is already taken`, { username });
  }
}
