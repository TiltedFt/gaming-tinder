import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  GAME_EDITOR_SCENE,
  PROFILE_SCENE,
} from 'src/common/constants/app-constants';
import type { Context } from 'src/interfaces/context.interface';
import { GameService } from 'src/game/game.service';
import { I18nService } from 'nestjs-i18n';
import { I18nKey } from 'src/i18n/i18n-keys';
import { GameListKeyboard } from './components/game-list-keyboard.component';
import { Markup } from 'telegraf';
import { Language } from 'src/common/constants/supported-language';
import { GameSearchResultsKeyboard } from './components/game-search-results-keyboard.component';
import {
  ADD_RESULT_PREFIX,
  GameEditorAction,
  REMOVE_PREFIX,
} from './game-editor.constants';

const GAMES_PER_PAGE = 10;
const MAX_GAMES = 20;

enum GameEditorStep {
  LIST = 'list',
  SEARCH = 'search',
  RESULTS = 'results',
}

@Scene(GAME_EDITOR_SCENE)
export class GameEditorSceneService {
  constructor(
    private readonly gameService: GameService,
    private readonly gameListKeyboard: GameListKeyboard,
    private readonly gameSearchResultsKeyboard: GameSearchResultsKeyboard,
    private readonly i18n: I18nService,
  ) {}

  private t(
    key: string,
    lang: Language,
    args?: Record<string, unknown>,
  ): string {
    return this.i18n.t(key, { lang, args }) as string;
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    ctx.scene.state.gameEditorStep = GameEditorStep.LIST;
    ctx.scene.state.gamePage = 1;
    await this.showGameList(ctx);
  }

  private async showGameList(ctx: Context, editMessage = false) {
    const lang = ctx.dbUser!.botLanguage;
    const page = ctx.scene.state.gamePage ?? 1;

    const { games, total, totalPages } =
      await this.gameService.getUserGamesPaginated(
        ctx.dbUser!.id,
        page,
        GAMES_PER_PAGE,
      );

    const title =
      total > 0
        ? this.t(I18nKey.GAMES_LIST_TITLE, lang, { current: total, total })
        : this.t(I18nKey.GAMES_LIST_EMPTY, lang);

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
        // welL:=
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

  @Action(GameEditorAction.EXPAND_SEARCH)
  async onExpandSearch(@Ctx() ctx: Context) {
    const query = ctx.scene.state.lastSearchQuery as string | undefined;
    if (!query) return;

    const lang = ctx.dbUser!.botLanguage;

    // get rawg and upsert that mf
    await this.gameService.fetchAndSaveFromApi(query, 5);

    // look again locally
    const results = await this.gameService.searchLocal(query, 5);
    ctx.scene.state.lastSearchResults = results.map((g) => g.id);

    const userGames = await this.gameService.getUserGames(ctx.dbUser!.id);
    const userGameIds = new Set(userGames.map((g) => g.id));

    const keyboard = this.gameSearchResultsKeyboard.render(
      results,
      userGameIds,
      lang,
    );

    try {
      await ctx.editMessageText(
        this.t(I18nKey.GAMES_SEARCH_RESULTS_TITLE, lang, { query }),
        keyboard,
      );
    } catch {
      await ctx.reply(
        this.t(I18nKey.GAMES_SEARCH_RESULTS_TITLE, lang, { query }),
        keyboard,
      );
    }
    await ctx.answerCbQuery();
  }

  @Action(new RegExp(`^${REMOVE_PREFIX}`))
  async onRemoveGame(@Ctx() ctx: Context) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const gameId = ctx.callbackQuery.data.replace(REMOVE_PREFIX, '');
    const lang = ctx.dbUser!.botLanguage;

    const games = await this.gameService.getUserGames(ctx.dbUser!.id);
    const game = games.find((g) => g.id === gameId);

    await this.gameService.removeGameFromUser(ctx.dbUser!.id, gameId);

    if (game) {
      await ctx.answerCbQuery(
        this.t(I18nKey.GAMES_REMOVED, lang, { name: game.name }),
      );
    } else {
      await ctx.answerCbQuery();
    }

    await this.showGameList(ctx, true);
  }

  @Action(GameEditorAction.ADD_GAME)
  async onAddGame(@Ctx() ctx: Context) {
    const lang = ctx.dbUser!.botLanguage;

    const games = await this.gameService.getUserGames(ctx.dbUser!.id);
    if (games.length >= MAX_GAMES) {
      await ctx.answerCbQuery(
        this.t(I18nKey.GAMES_LIMIT_REACHED, lang, { limit: MAX_GAMES }),
      );
      return;
    }

    ctx.scene.state.gameEditorStep = GameEditorStep.SEARCH;
    await this.showSearchPrompt(ctx, lang);
    await ctx.answerCbQuery();
  }

  @Action(GameEditorAction.SEARCH_AGAIN)
  async onSearchAgain(@Ctx() ctx: Context) {
    ctx.scene.state.gameEditorStep = GameEditorStep.SEARCH;
    await this.showSearchPrompt(ctx, ctx.dbUser!.botLanguage);
    await ctx.answerCbQuery();
  }

  private async showSearchPrompt(ctx: Context, lang: Language) {
    const backKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.t(I18nKey.GAMES_BTN_BACK_TO_LIST, lang),
          GameEditorAction.BACK_TO_LIST,
        ),
      ],
    ]);
    await ctx.reply(this.t(I18nKey.GAMES_SEARCH_PROMPT, lang), backKeyboard);
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    if (ctx.scene.state.gameEditorStep !== GameEditorStep.SEARCH) return;
    if (!('text' in ctx.message!)) return;

    const query = ctx.message.text;
    if (query.startsWith('/')) return;

    const lang = ctx.dbUser!.botLanguage;
    const results = await this.gameService.search(query, 5);

    if (!results.length) {
      const backKeyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback(
            this.t(I18nKey.GAMES_BTN_BACK_TO_LIST, lang),
            GameEditorAction.BACK_TO_LIST,
          ),
        ],
      ]);
      await ctx.reply(
        this.t(I18nKey.GAMES_SEARCH_NO_RESULTS, lang, { query }),
        backKeyboard,
      );
      return;
    }

    ctx.scene.state.gameEditorStep = GameEditorStep.RESULTS;
    ctx.scene.state.lastSearchResults = results.map((g) => g.id);

    const userGames = await this.gameService.getUserGames(ctx.dbUser!.id);
    const userGameIds = new Set(userGames.map((g) => g.id));

    const keyboard = this.gameSearchResultsKeyboard.render(
      results,
      userGameIds,
      lang,
    );
    await ctx.reply(
      this.t(I18nKey.GAMES_SEARCH_RESULTS_TITLE, lang, { query }),
      keyboard,
    );
  }

  @Action(new RegExp(`^${ADD_RESULT_PREFIX}`))
  async onAddFromResults(@Ctx() ctx: Context) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const gameId = ctx.callbackQuery.data.replace(ADD_RESULT_PREFIX, '');
    const lang = ctx.dbUser!.botLanguage;

    const added = await this.gameService.addGameToUser(ctx.dbUser!.id, gameId);

    if (added) {
      await this.refreshSearchResults(ctx);
      await ctx.answerCbQuery(this.t(I18nKey.GAMES_ADDED, lang, { name: '' }));
    } else {
      await ctx.answerCbQuery(
        this.t(I18nKey.GAMES_ALREADY_ADDED, lang, { name: '' }),
      );
    }
  }

  private async refreshSearchResults(ctx: Context) {
    const lang = ctx.dbUser!.botLanguage;
    const lastResults = ctx.scene.state.lastSearchResults as
      | string[]
      | undefined;
    if (!lastResults?.length) return;

    const results = await this.gameService.findByIds(lastResults);
    const userGames = await this.gameService.getUserGames(ctx.dbUser!.id);
    const userGameIds = new Set(userGames.map((g) => g.id));

    const keyboard = this.gameSearchResultsKeyboard.render(
      results,
      userGameIds,
      lang,
    );

    try {
      await ctx.editMessageReplyMarkup(keyboard.reply_markup);
    } catch {
      // well ...
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
