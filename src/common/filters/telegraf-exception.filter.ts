import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectBot, TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import type { Context } from 'src/interfaces/context.interface';
import { BotError } from '../errors/bot-error';
import {
  DEFAULT_BOT_LANGUAGE,
  MAIN_MENU_SCENE,
} from '../constants/app-constants';
import { ServerErrorKey } from 'src/i18n/i18n-keys';

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
        }) as string,
      );
      return;
    }

    await ctx.reply(
      this.i18n.t(ServerErrorKey.SOMETHING_WENT_WRONG, { lang }) as string,
    );
    await this.notifyAdmin(ctx, exception);

    try {
      await ctx.scene.leave();
      await ctx.scene.enter(MAIN_MENU_SCENE);
    } catch {
      // Scene management failed — nothing else we can do
    }
  }

  private getLang(ctx: Context): string {
    if (ctx.dbUser?.botLanguage?.code) return ctx.dbUser.getBotLanguageCode;

    // wizard context: language code stored in wizard state during registration
    const wizard = (ctx as Record<string, any>).wizard;
    const lang = wizard?.state?.botLanguageCode;
    if (lang) return lang;

    return DEFAULT_BOT_LANGUAGE;
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
