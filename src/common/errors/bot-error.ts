export abstract class BotError extends Error {
  abstract readonly i18nKey: string;

  readonly i18nArgs?: Record<string, unknown>;

  constructor(message: string, i18nArgs?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.i18nArgs = i18nArgs;
  }
}
