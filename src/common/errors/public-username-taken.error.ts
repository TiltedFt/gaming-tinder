import { UserErrorKey } from 'src/i18n/i18n-keys';
import { BotError } from './bot-error';

export class PublicUsernameTakenError extends BotError {
  readonly i18nKey = UserErrorKey.USERNAME_TAKEN;

  constructor(username: string) {
    super(`Username "${username}" is already taken`, { username });
  }
}
