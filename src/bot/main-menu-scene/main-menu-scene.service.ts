import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  BotCommand,
  MAIN_MENU_SCENE,
  PROFILE_SCENE,
} from 'src/common/constants/app-constants';
import {
  MainMenuComponent,
  MenuAction,
} from './components/main-menu.component';
import type { Context } from '../../interfaces/context.interface';
import { ProfileCardComponent } from '../profile/components/profile-card.component';
import { ProfileKeyboardComponent } from '../profile/components/profile-keyboard.component';

@Scene(MAIN_MENU_SCENE)
export class MainMenuSceneService {
  constructor(
    private readonly mainMenuComponent: MainMenuComponent,
    //private readonly profileCard: ProfileCardComponent,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const menu = this.mainMenuComponent.render(ctx.dbUser!.botLanguage);
    await ctx.reply('Menu Options:', menu);
  }

  @Action(MenuAction.GO_TO_PROFILE)
  async onShowProfile(@Ctx() ctx: Context) {
    /*    const lang = ctx.dbUser!.language;
    const text = this.profileCard.render(ctx.dbUser!);
    const keyboard = this.profileKeyboard.render(lang);

    await ctx.editMessageText(text, keyboard);
    await ctx.answerCbQuery(); */
    await ctx.scene.enter(PROFILE_SCENE);
  }
}
