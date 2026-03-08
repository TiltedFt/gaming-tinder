import { I18nService } from 'nestjs-i18n';

export abstract class BaseComponent {
  constructor(protected readonly i18n: I18nService) {}

  protected t(
    key: string,
    lang: string,
    args?: Record<string, unknown>,
  ): string {
    return this.i18n.t(key, { lang, args }) as string;
  }
}
