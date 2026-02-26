import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  MAIN_MENU_SCENE,
  PROFILE_SCENE,
} from 'src/common/constants/app-constants';
import {
  MainMenuComponent,
  MenuAction,
} from './components/main-menu.component';
import type { Context } from '../../interfaces/context.interface';

@Scene(MAIN_MENU_SCENE)
export class MainMenuSceneService {
  constructor(private readonly mainMenuComponent: MainMenuComponent) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const menu = this.mainMenuComponent.render(ctx.dbUser!.botLanguage);
    await ctx.reply('Menu Options:', menu);
  }

  @Action(MenuAction.GO_TO_PROFILE)
  async onShowProfile(@Ctx() ctx: Context) {
    await ctx.scene.enter(PROFILE_SCENE);
  }
}
