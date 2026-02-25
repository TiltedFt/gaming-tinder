import { UseFilters } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

import {
  Command,
  Ctx,
  Message,
  Sender,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import {
  MAIN_MENU_SCENE,
  REGISTRATION_WIZARD_SCENE,
} from 'src/common/constants/app-constants';
import { Language } from 'src/common/constants/supported-language';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { isSupportedLanguage } from 'src/common/utils/utils';
import type { BotWizardContext } from 'src/interfaces/context.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { I18nKey } from 'src/i18n/i18n-keys';
import { BotError } from 'src/common/errors/bot-error';
import { LanguageKeyboardComponent } from './components/language-keyboard.component';
import { UserService } from 'src/user/user.service';

// to do: inherit from BaseComponent!
@Wizard(REGISTRATION_WIZARD_SCENE)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationScene {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
    private readonly languageKeyboard: LanguageKeyboardComponent,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: BotWizardContext) {
    const lang = this.detectLanguage(ctx);
    const message = this.getLanguagePrompt(lang);
    await ctx.reply(message, this.languageKeyboard.render());
    await ctx.wizard.next();
  }

  private detectLanguage(ctx: BotWizardContext): Language {
    const code = ctx.from?.language_code;
    return code && isSupportedLanguage(code) ? code : Language.ENGLISH;
  }

  private getLanguagePrompt(lang: string): string {
    return isSupportedLanguage(lang)
      ? this.i18n.t(I18nKey.LANGUAGE_FOUND, {
          lang,
          args: { language: lang.toUpperCase() },
        })
      : this.i18n.t(I18nKey.LANGUAGE_NOT_FOUND, { lang: Language.ENGLISH });
  }

  @WizardStep(2)
  async onLanguageSelected(@Ctx() ctx: BotWizardContext) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      await ctx.reply(
        this.i18n.t(I18nKey.PLEASE_USE_BUTTONS, { lang: Language.ENGLISH }),
      );
      return;
    }

    if (ctx.wizard.state['language']) {
      await ctx.answerCbQuery();
      return;
    }

    const match = ctx.callbackQuery.data.match(/^lang_(.+)$/);
    if (!match) return;

    const lang = match[1];
    ctx.wizard.state['language'] = lang;

    await ctx.answerCbQuery();
    await ctx.reply(this.i18n.t(I18nKey.ASK_PUBLIC_USERNAME, { lang }));
    ctx.wizard.next();
  }

  @WizardStep(3)
  async onPublicUsername(
    @Ctx() ctx: BotWizardContext,
    @Message('text') publicUsername: string,
    @Sender('id') telegramId: number,
    @Sender('username') telegramUsername: string | undefined,
  ) {
    const language = ctx.wizard.state['language'];

    if (publicUsername === '/start') {
      await ctx.scene.leave();
      return;
    }

    if (!language) return this.handleExpiredSession(ctx);
    if (!publicUsername) return this.askForText(ctx, language);

    const dto = plainToInstance(CreateUserDto, {
      telegramId,
      publicUsername,
      telegramUsername: telegramUsername ?? null,
      language,
    });

    const errors = await validate(dto);
    if (errors.length) return this.askForValidUsername(ctx, language);

    await this.completeRegistration(ctx, dto, language);
  }

  private async handleExpiredSession(ctx: BotWizardContext) {
    await ctx.reply(
      this.i18n.t(I18nKey.SESSION_EXPIRED, { lang: Language.ENGLISH }),
    );
    await ctx.scene.reenter();
  }

  private async askForText(ctx: BotWizardContext, lang: string) {
    await ctx.reply(this.i18n.t(I18nKey.TEXT_ONLY_PLEASE, { lang }));
  }

  private async askForValidUsername(ctx: BotWizardContext, lang: string) {
    await ctx.reply(this.i18n.t(I18nKey.INVALID_PUBLIC_USERNAME, { lang }));
  }

  // show profile and suggest to customize it OR start searching
  private async completeRegistration(
    ctx: BotWizardContext,
    dto: CreateUserDto,
    lang: string,
  ) {
    try {
      const user = await this.userService.findOrCreate(dto);
      ctx.dbUser = user;

      await ctx.scene.enter(MAIN_MENU_SCENE);
    } catch (error) {
      if (error instanceof BotError) {
        await ctx.reply(
          this.i18n.t(error.i18nKey, { lang, args: error.i18nArgs }),
        );
        return;
      }
      throw error;
    }
  }
}
