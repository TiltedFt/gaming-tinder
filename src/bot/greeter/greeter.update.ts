import { Ctx, Start, Update, Sender } from 'nestjs-telegraf';
import type { Context } from '../../interfaces/context.interface';
import { I18nService } from 'nestjs-i18n';
import { UserService } from 'src/user/user.service';
import { Inject } from '@nestjs/common';
import { REGISTRATION_WIZARD_SCENE, MAIN_MENU_SCENE } from 'src/common/app-constants';

@Update()
export class GreeterUpdate {
  constructor(private readonly i18n: I18nService) {}

  @Inject(UserService)
  private readonly userService: UserService

  @Start()
  async onStart(@Ctx() ctx: Context, @Sender('id') telegramId: string) {
    const user = await this.userService.findByTelegramId(telegramId);
    
    if (!user) {
      await ctx.scene.enter(REGISTRATION_WIZARD_SCENE);
    } else {
      await ctx.scene.enter(MAIN_MENU_SCENE);
    }
  }
}