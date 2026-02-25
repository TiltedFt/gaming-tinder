import { I18nService } from 'nestjs-i18n';
import { Language } from 'src/common/constants/supported-language';

export abstract class BaseComponent {
  constructor(protected readonly i18n: I18nService) {}

  protected t(
    key: string,
    language: Language,
    args?: Record<string, unknown>,
  ): string {
    return this.i18n.t(key, { lang: language, args }) as string;
  }
}
