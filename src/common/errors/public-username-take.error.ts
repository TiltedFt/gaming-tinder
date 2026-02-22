import { BotError } from './bot-error';

export class PublicUsernameTakenError extends BotError {
    readonly i18nKey = 'errors.username_taken';

    constructor(username: string) {
        super(`Username "${username}" is already taken`, { username });
    }
}
