export abstract class BotError extends Error {
  abstract readonly i18nKey: string;
  // arguments if i18n message has any
  readonly i18nArgs?: Record<string, unknown>;

  constructor(message: string, i18nArgs?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.i18nArgs = i18nArgs;
  }
}
