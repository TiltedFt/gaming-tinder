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
import { BotError } from '../errors/bot-error';
import { I18nKey } from 'src/i18n/i18n-keys';
import { MAIN_MENU_SCENE } from '../constants/app-constants';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService,
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly configService: ConfigService,
  ) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = TelegrafArgumentsHost.create(host).getContext<Context>();
    const lang = this.getLang(ctx);

    if (exception instanceof BotError) {
      await ctx.reply(
        this.i18n.t(exception.i18nKey, {
          lang,
          args: exception.i18nArgs,
        }),
      );
      return;
    }

    await ctx.reply(this.i18n.t(I18nKey.SOMETHING_WENT_WRONG, { lang }));
    await this.notifyAdmin(ctx, exception);

    // in case if unknown error - leave the scene, otherwise it breaks flow
    try {
      await ctx.scene.leave();
      await ctx.scene.enter(MAIN_MENU_SCENE);
    } catch {
      // well, we are fucked
    }
  }

  private getLang(ctx: Context) {
    if (ctx.dbUser?.botLanguage) return ctx.dbUser.botLanguage;

    const wizard = (ctx as Record<string, any>).wizard;
    const lang = wizard?.state?.language;
    if (lang) return lang;

    return Language.ENGLISH;
  }

  private async notifyAdmin(ctx: Context, exception: Error) {
    const adminId = this.configService.get('ADMIN_TELEGRAM_ID');
    if (!adminId) return;

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
}
