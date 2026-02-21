// common/filters/telegraf-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectBot, TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  private readonly ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_ID;

  private getLang(ctx: Context) {
    // if user exists
    // @ts-ignore
    if (ctx.dbUser?.language) return ctx.dbUser.language;

    // error while creating profile
    // @ts-ignore
    if (ctx.wizard?.state?.['language']) return ctx.wizard.state['language'];

    // fallback
    return ctx.from?.language_code || 'en';
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = TelegrafArgumentsHost.create(host).getContext<Context>();
    const lang = ctx.from?.language_code || 'en';

    // Ответ юзеру на его языке
    await ctx.reply(this.i18n.t('errors.something_went_wrong', { lang }));

    // Оповещение админу
    if (this.ADMIN_CHAT_ID) {
      const errorInfo = [
        `🚨 *Error in bot*`,
        `User: ${ctx.from?.username || ctx.from?.id}`,
        `Error: \`${exception.message}\``,
        `Stack: \`${exception.stack?.slice(0, 300)}\``,
      ].join('\n');

      await this.bot.telegram.sendMessage(this.ADMIN_CHAT_ID, errorInfo, {
        parse_mode: 'Markdown',
      });
    }

    console.error('Bot error:', exception);
  }
}
