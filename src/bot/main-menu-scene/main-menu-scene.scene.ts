import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  BotCommand,
  MAIN_MENU_SCENE,
} from 'src/common/constants/app-constants';
import {
  MainMenuComponent,
  MenuAction,
} from '../components/main-menu.component';
import type { Context } from '../../interfaces/context.interface';
import { ProfileCardComponent } from '../components/profile-card.component';
import { ProfileKeyboardComponent } from '../components/profile-leyboard.component';

@Scene(MAIN_MENU_SCENE)
export class MainMenuSceneService {
  constructor(
    private readonly mainMenuComponent: MainMenuComponent,
    private readonly profileCard: ProfileCardComponent,
    private readonly profileKeyboard: ProfileKeyboardComponent,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const menu = this.mainMenuComponent.render(ctx.dbUser!.language);
    await ctx.reply('Hello', menu);
  }

  @Action(MenuAction.GO_TO_PROFILE)
  async onShowProfile(@Ctx() ctx: Context) {
    console.log(ctx.dbUser)
    const lang = ctx.dbUser!.language;
    const text = this.profileCard.render(ctx.dbUser!);
    const keyboard = this.profileKeyboard.render(lang);

    await ctx.editMessageText(text, keyboard);
    await ctx.answerCbQuery();
  }
}
