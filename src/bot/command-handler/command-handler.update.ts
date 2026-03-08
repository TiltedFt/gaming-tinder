import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import type { Context } from 'src/interfaces/context.interface';
import { I18nHelper } from 'src/common/helper/i18n-helper/i18n.helper';
import {
  REGISTRATION_WIZARD_SCENE,
  MAIN_MENU_SCENE,
  BotCommand,
  PROFILE_SCENE,
} from 'src/common/constants/app-constants';
import { I18nKey } from 'src/i18n/i18n-keys';
import { Language } from 'src/common/constants/supported-language';

@Update()
export class CommandHandler {
  constructor(private readonly i18n: I18nHelper) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (!ctx.dbUser) {
      const lang = (ctx.from?.language_code as Language) || Language.ENGLISH;
      await ctx.reply(this.i18n.t(I18nKey.WELCOME_NEW_USER, lang));
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
}
