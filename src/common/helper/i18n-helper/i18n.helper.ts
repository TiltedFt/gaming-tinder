import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Language } from 'src/common/constants/supported-language';

@Injectable()
export class I18nHelper {
  constructor(private readonly i18n: I18nService) {}

  t(key: string, lang: Language, args?: Record<string, unknown>): string {
    return this.i18n.t(key, { lang, args }) as string;
  }
}
