// common/filters/telegraf-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectBot, TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import type {
  BotWizardContext,
  Context,
} from 'src/interfaces/context.interface';
import { Language } from '../constants/supported-language';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService,
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly configService: ConfigService,
  ) {}

  private getLang(ctx: Context) {
    if (ctx.dbUser?.language) return ctx.dbUser.language;

    if ('wizard' in ctx) {
      const wizardCtx = ctx as BotWizardContext;
      const lang = wizardCtx.wizard?.state?.['language'];
      if (lang) return lang;
    }
    // fallback
    return Language.ENGLISH;
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = TelegrafArgumentsHost.create(host).getContext<Context>();
    const lang = this.getLang(ctx);

    await ctx.reply(this.i18n.t('errors.something_went_wrong', { lang }));
    const adminId: string | undefined =
      this.configService.get('ADMIN_TELEGRAM_ID');
    if (adminId) {
      const errorInfo = [
        `🚨 *Error in bot*`,
        `User: ${ctx.from?.username || ctx.from?.id}`,
        `Error: \`${exception.message}\``,
        `Stack: \`${exception.stack?.slice(0, 300)}\``,
      ].join('\n');

      await this.bot.telegram.sendMessage(adminId, errorInfo, {
        parse_mode: 'Markdown',
      });
    }

    console.error('Bot error:', exception);
  }
}
