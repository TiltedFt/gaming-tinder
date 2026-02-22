import { Ctx, Start, Update, Sender } from 'nestjs-telegraf';
import type { Context } from '../../interfaces/context.interface';
import { I18nService } from 'nestjs-i18n';
import { UserService } from 'src/user/user.service';
import { Inject } from '@nestjs/common';
import {
  REGISTRATION_WIZARD_SCENE,
  MAIN_MENU_SCENE,
} from 'src/common/constants/app-constants';

@Update()
export class GreeterUpdate {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context, @Sender('id') telegramId: number) {
    const lang = ctx.from?.language_code || 'en';
    const user = await this.userService.findByTelegramId(telegramId);

    if (!user) {
      await ctx.reply(this.i18n.t('greeter.welcome_new', { lang }));
      await ctx.scene.enter(REGISTRATION_WIZARD_SCENE);
    } else {
      ctx.dbUser = user;
      await ctx.scene.enter(MAIN_MENU_SCENE);
    }
  }
}
