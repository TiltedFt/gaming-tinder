import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  MAIN_MENU_SCENE,
  PROFILE_SCENE,
  SEARCH_PLAYERS_SCENE,
} from 'src/common/constants/app-constants';
import {
  MainMenuComponent,
  MenuAction,
} from './components/main-menu.component';
import type { Context } from '../../interfaces/context.interface';
import { I18nHelper } from 'src/common/helper/i18n-helper/i18n.helper';
import { I18nKey } from 'src/i18n/i18n-keys';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';

@Scene(MAIN_MENU_SCENE)
@UseFilters(TelegrafExceptionFilter)
export class MainMenuSceneService {
  constructor(
    private readonly mainMenuComponent: MainMenuComponent,
    private readonly i18n: I18nHelper,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const lang = ctx.dbUser!.getBotLanguageCode;
    const menu = this.mainMenuComponent.render(lang);
    await ctx.reply(this.i18n.t(I18nKey.MAIN_MENU_TITLE, lang), menu);
  }

  @Action(MenuAction.GO_TO_PROFILE)
  async onGoToProfile(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(PROFILE_SCENE);
  }

  @Action(MenuAction.START_TO_SEARCH)
  async onStartToSearch(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(SEARCH_PLAYERS_SCENE);
  }
}
