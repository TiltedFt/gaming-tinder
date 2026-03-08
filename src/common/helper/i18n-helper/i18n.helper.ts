import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class I18nHelper {
  constructor(private readonly i18n: I18nService) {}

  t(key: string, lang: string, args?: Record<string, unknown>): string {
    return this.i18n.t(key, { lang, args }) as string;
  }
}
