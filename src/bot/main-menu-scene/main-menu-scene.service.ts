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
import { I18nService } from 'nestjs-i18n';
import { I18nKey } from 'src/i18n/i18n-keys';

@Scene(MAIN_MENU_SCENE)
export class MainMenuSceneService {
  constructor(
    private readonly mainMenuComponent: MainMenuComponent,
    private readonly i18n: I18nService, // ← добавить
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const lang = ctx.dbUser!.botLanguage;
    const menu = this.mainMenuComponent.render(lang);
    await ctx.reply(
      this.i18n.t(I18nKey.MAIN_MENU_TITLE, { lang }) as string,
      menu,
    );
  }
}
