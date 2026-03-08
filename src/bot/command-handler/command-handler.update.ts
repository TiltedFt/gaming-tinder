import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import type { Context } from 'src/interfaces/context.interface';
import { I18nHelper } from 'src/common/helper/i18n-helper/i18n.helper';
import {
  REGISTRATION_WIZARD_SCENE,
  MAIN_MENU_SCENE,
  BotCommand,
  PROFILE_SCENE,
  DEFAULT_BOT_LANGUAGE,
} from 'src/common/constants/app-constants';
import { LanguageService } from 'src/language/language.service';
import { GreeterKey } from 'src/i18n/i18n-keys';

@Update()
export class CommandHandler {
  constructor(
    private readonly i18n: I18nHelper,
    private readonly languageService: LanguageService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (!ctx.dbUser) {
      const languageCode = await this.getNewUsersLanguage(
        ctx.from?.language_code,
      );

      await ctx.reply(this.i18n.t(GreeterKey.WELCOME_NEW_USER, languageCode));
      await ctx.scene.enter(REGISTRATION_WIZARD_SCENE);
      return;
    }

    await ctx.scene.enter(MAIN_MENU_SCENE);
  }

  @Command(BotCommand.MENU)
  async onMenu(@Ctx() ctx: Context) {
    await ctx.scene.enter(MAIN_MENU_SCENE);
  }

  @Command(BotCommand.PROFILE)
  async onProfile(@Ctx() ctx: Context) {
    await ctx.scene.enter(PROFILE_SCENE);
  }

  @Command(BotCommand.SEARCH)
  async onSearch(@Ctx() ctx: Context) {
    await ctx.reply('menu command, working on it');
  }

  @Command(BotCommand.HELP)
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply('help command, working on it');
  }

  private async getNewUsersLanguage(code: string | undefined): Promise<string> {
    if (!code) return DEFAULT_BOT_LANGUAGE;

    const language = await this.languageService.findBotsLanguageByCode(code);
    if (language?.code) {
      return language.code;
    }

    return DEFAULT_BOT_LANGUAGE;
  }
}
