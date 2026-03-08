import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  GAME_EDITOR_SCENE,
  PROFILE_SCENE,
} from 'src/common/constants/app-constants';
import type { Context } from 'src/interfaces/context.interface';
import { GameService } from 'src/game/game.service';
import { UserGameService } from 'src/game/user-game.service';
import { I18nHelper } from 'src/common/helper/i18n-helper/i18n.helper';
import { GameListKeyboard } from './components/game-list-keyboard.component';
import { Markup } from 'telegraf';
import { GameSearchResultsKeyboard } from './components/game-search-results-keyboard.component';
import {
  ADD_RESULT_PREFIX,
  GameEditorAction,
  REMOVE_PREFIX,
} from './game-editor.constants';
import { Game } from 'src/game/entity/game.entity';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { GamesKey } from 'src/i18n/i18n-keys';

const GAMES_PER_PAGE = 10;
const MAX_GAMES = 20;

enum GameEditorStep {
  LIST = 'list',
  SEARCH = 'search',
  RESULTS = 'results',
}

@Scene(GAME_EDITOR_SCENE)
@UseFilters(TelegrafExceptionFilter)
export class GameEditorSceneService {
  constructor(
    private readonly gameService: GameService,
    private readonly userGameService: UserGameService,
    private readonly i18n: I18nHelper,
    private readonly gameListKeyboard: GameListKeyboard,
    private readonly gameSearchResultsKeyboard: GameSearchResultsKeyboard,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    ctx.scene.state.gameEditorStep = GameEditorStep.LIST;
    ctx.scene.state.gamePage = 1;
    await this.showGameList(ctx);
  }

  private async showGameList(ctx: Context, editMessage = false) {
    const lang = ctx.dbUser!.getBotLanguageCode;
    const page = ctx.scene.state.gamePage ?? 1;

    const { games, total, totalPages } =
      await this.userGameService.getUserGamesPaginated(
        ctx.dbUser!.id,
        page,
        GAMES_PER_PAGE,
      );

    const title =
      total > 0
        ? this.i18n.t(GamesKey.LIST_TITLE, lang, { current: total, total })
        : this.i18n.t(GamesKey.LIST_EMPTY, lang);

    const keyboard = this.gameListKeyboard.render(
      games,
      lang,
      page,
      totalPages,
    );

    if (editMessage) {
      try {
        await ctx.editMessageText(title, keyboard);
        return;
      } catch {
        // well :)
      }
    }
    await ctx.reply(title, keyboard);
  }

  @Action(GameEditorAction.PREV_PAGE)
  async onPrevPage(@Ctx() ctx: Context) {
    const page = ctx.scene.state.gamePage ?? 1;
    ctx.scene.state.gamePage = Math.max(1, page - 1);
    await this.showGameList(ctx, true);
    await ctx.answerCbQuery();
  }

  @Action(GameEditorAction.NEXT_PAGE)
  async onNextPage(@Ctx() ctx: Context) {
    const page = ctx.scene.state.gamePage ?? 1;
    ctx.scene.state.gamePage = page + 1;
    await this.showGameList(ctx, true);
    await ctx.answerCbQuery();
  }

  @Action(new RegExp(`^${REMOVE_PREFIX}`))
  async onRemoveGame(@Ctx() ctx: Context) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const gameId = ctx.callbackQuery.data.replace(REMOVE_PREFIX, '');
    const lang = ctx.dbUser!.getBotLanguageCode;

    const games = await this.userGameService.getUserGames(ctx.dbUser!.id);
    const game = games.find((g) => g.id === gameId);

    await this.userGameService.removeGameFromUser(ctx.dbUser!.id, gameId);

    if (game) {
      await ctx.answerCbQuery(
        this.i18n.t(GamesKey.REMOVED, lang, { name: game.name }),
      );
    } else {
      await ctx.answerCbQuery();
    }

    await this.showGameList(ctx, true);
  }

  @Action(GameEditorAction.ADD_GAME)
  async onAddGame(@Ctx() ctx: Context) {
    const lang = ctx.dbUser!.getBotLanguageCode;

    const games = await this.userGameService.getUserGames(ctx.dbUser!.id);
    if (games.length >= MAX_GAMES) {
      await ctx.answerCbQuery(
        this.i18n.t(GamesKey.LIMIT_REACHED, lang, { limit: MAX_GAMES }),
      );
      return;
    }

    ctx.scene.state.gameEditorStep = GameEditorStep.SEARCH;
    await this.showSearchPrompt(ctx, lang);
    await ctx.answerCbQuery();
  }

  private async showSearchPrompt(ctx: Context, lang: string) {
    const backKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.i18n.t(GamesKey.BTN_BACK_TO_LIST, lang),
          GameEditorAction.BACK_TO_LIST,
        ),
      ],
    ]);
    await ctx.reply(this.i18n.t(GamesKey.SEARCH_PROMPT, lang), backKeyboard);
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const step = ctx.scene.state.gameEditorStep;
    if (step !== GameEditorStep.SEARCH && step !== GameEditorStep.RESULTS)
      return;
    if (!('text' in ctx.message!)) return;

    const query = ctx.message.text;
    const lang = ctx.dbUser!.getBotLanguageCode;
    const results = await this.gameService.search(query, 5);

    if (!results.length) {
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(
            this.i18n.t(GamesKey.BTN_BACK_TO_LIST, lang),
            GameEditorAction.BACK_TO_LIST,
          ),
        ],
      ]);
      await ctx.reply(
        this.i18n.t(GamesKey.SEARCH_NO_RESULTS, lang, { query }),
        keyboard,
      );
      return;
    }

    ctx.scene.state.gameEditorStep = GameEditorStep.RESULTS;
    ctx.scene.state.lastSearchResults = results.map((g) => g.id);
    ctx.scene.state.lastSearchQuery = query;

    const userGames = await this.userGameService.getUserGames(ctx.dbUser!.id);
    const userGameIds = new Set(userGames.map((g) => g.id));

    const keyboard = this.gameSearchResultsKeyboard.render(
      results,
      userGameIds,
      lang,
    );
    await ctx.reply(
      this.i18n.t(GamesKey.SEARCH_RESULTS_TITLE, lang, { query }),
      keyboard,
    );
  }

  @Action(new RegExp(`^${ADD_RESULT_PREFIX}`))
  async onAddFromResults(@Ctx() ctx: Context) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const gameId = ctx.callbackQuery.data.replace(ADD_RESULT_PREFIX, '');
    const lang = ctx.dbUser!.getBotLanguageCode;

    const added = await this.userGameService.addGameToUser(
      ctx.dbUser!.id,
      gameId,
    );

    if (added) {
      await this.refreshSearchResults(ctx);
      await ctx.answerCbQuery(this.i18n.t(GamesKey.ADDED, lang));
    } else {
      await ctx.answerCbQuery(this.i18n.t(GamesKey.ALREADY_ADDED, lang));
    }
  }

  private async refreshSearchResults(ctx: Context) {
    const lang = ctx.dbUser!.getBotLanguageCode;
    const lastResults = ctx.scene.state.lastSearchResults;
    if (!lastResults?.length) return;

    const results = await this.gameService.findByIds(lastResults);
    const ordered = lastResults
      .map((id: string) => results.find((g) => g.id === id))
      .filter(Boolean) as Game[];

    const userGames = await this.userGameService.getUserGames(ctx.dbUser!.id);
    const userGameIds = new Set(userGames.map((g) => g.id));

    const keyboard = this.gameSearchResultsKeyboard.render(
      ordered,
      userGameIds,
      lang,
    );

    try {
      await ctx.editMessageReplyMarkup(keyboard.reply_markup);
    } catch {
      // well :)
    }
  }

  @Action(GameEditorAction.BACK_TO_LIST)
  async onBackToList(@Ctx() ctx: Context) {
    ctx.scene.state.gameEditorStep = GameEditorStep.LIST;
    ctx.scene.state.gamePage = 1;
    await this.showGameList(ctx, false);
    await ctx.answerCbQuery();
  }

  @Action(GameEditorAction.BACK_TO_PROFILE)
  async onBackToProfile(@Ctx() ctx: Context) {
    await ctx.scene.enter(PROFILE_SCENE);
    await ctx.answerCbQuery();
  }
}
