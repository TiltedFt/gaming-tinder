import { UseFilters } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { Ctx, Message, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  DEFAULT_BOT_LANGUAGE,
  MAIN_MENU_SCENE,
  REGISTRATION_WIZARD_SCENE,
} from 'src/common/constants/app-constants';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import type { BotWizardContext } from 'src/interfaces/context.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BotError } from 'src/common/errors/bot-error';
import { LanguageKeyboardComponent } from './components/language-keyboard.component';
import { UserService } from 'src/user/user.service';
import { LanguageService } from 'src/language/language.service';
import { ProfileKey, RegistrationKey, UserErrorKey } from 'src/i18n/i18n-keys';

@Wizard(REGISTRATION_WIZARD_SCENE)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationScene {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
    private readonly languageKeyboard: LanguageKeyboardComponent,
    private readonly languageService: LanguageService,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: BotWizardContext) {
    const languages = await this.languageService.getBotsLanguages();
    const detected = languages.find((l) => l.code === ctx.from?.language_code);
    const lang = detected?.code ?? DEFAULT_BOT_LANGUAGE;

    const messageKey = detected
      ? RegistrationKey.LANGUAGE_FOUND
      : RegistrationKey.LANGUAGE_NOT_FOUND;

    const message = this.i18n.t(messageKey, {
      lang,
      args: { language: lang.toUpperCase() },
    }) as string;

    await ctx.reply(message, this.languageKeyboard.render(languages));
    await ctx.wizard.next();
  }

  @WizardStep(2)
  async onLanguageSelected(@Ctx() ctx: BotWizardContext) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      await ctx.reply(
        this.i18n.t(UserErrorKey.PLEASE_USE_BUTTONS, {
          lang: DEFAULT_BOT_LANGUAGE,
        }) as string,
      );
      return;
    }

    if (ctx.wizard.state['botLanguageCode']) {
      await ctx.answerCbQuery();
      return;
    }

    const match = ctx.callbackQuery.data.match(/^lang_(.+)$/);
    if (!match) return;

    const selectedCode = match[1];

    const language =
      await this.languageService.findBotsLanguageByCode(selectedCode);
    if (!language) return;

    ctx.wizard.state['botLanguageCode'] = language.code;
    ctx.wizard.state['botLanguageId'] = language.id;

    await ctx.answerCbQuery();
    await ctx.reply(
      this.i18n.t(RegistrationKey.ASK_PUBLIC_USERNAME, {
        lang: language.code,
      }) as string,
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  async onPublicUsername(
    @Ctx() ctx: BotWizardContext,
    @Message('text') publicUsername: string,
    @Sender('id') telegramId: number,
    @Sender('username') telegramUsername: string | undefined,
  ) {
    const botLanguageCode = ctx.wizard.state['botLanguageCode'] as
      | string
      | undefined;
    const botLanguageId = ctx.wizard.state['botLanguageId'] as
      | string
      | undefined;

    if (publicUsername === '/start') {
      await ctx.scene.leave();
      return;
    }

    if (!botLanguageCode || !botLanguageId)
      return this.handleExpiredSession(ctx);
    if (!publicUsername) return this.askForText(ctx, botLanguageCode);

    const language =
      await this.languageService.findBotsLanguageByCode(botLanguageCode);
    if (!language) return this.handleExpiredSession(ctx);

    const dto = plainToInstance(CreateUserDto, {
      telegramId,
      publicUsername,
      telegramUsername: telegramUsername ?? null,
      botLanguage: language,
    });

    const errors = await validate(dto);
    if (errors.length) return this.askForValidUsername(ctx, botLanguageCode);

    await this.completeRegistration(ctx, dto, botLanguageCode);
  }

  private async handleExpiredSession(ctx: BotWizardContext) {
    await ctx.reply(
      this.i18n.t(UserErrorKey.SESSION_EXPIRED, {
        lang: DEFAULT_BOT_LANGUAGE,
      }) as string,
    );
    await ctx.scene.reenter();
  }

  private async askForText(ctx: BotWizardContext, lang: string) {
    await ctx.reply(
      this.i18n.t(UserErrorKey.TEXT_ONLY_PLEASE, { lang }) as string,
    );
  }

  private async askForValidUsername(ctx: BotWizardContext, lang: string) {
    await ctx.reply(
      this.i18n.t(UserErrorKey.INVALID_PUBLIC_USERNAME, { lang }) as string,
    );
  }

  private async completeRegistration(
    ctx: BotWizardContext,
    dto: CreateUserDto,
    lang: string,
  ) {
    try {
      const user = await this.userService.findOrCreate(dto);
      ctx.dbUser = user;

      await ctx.reply(
        this.i18n.t(ProfileKey.ONBOARDING_MESSAGE, { lang }) as string,
      );
      await ctx.scene.enter(MAIN_MENU_SCENE);
    } catch (error) {
      if (error instanceof BotError) {
        await ctx.reply(
          this.i18n.t(error.i18nKey, {
            lang,
            args: error.i18nArgs,
          }) as string,
        );
        return;
      }
      throw error;
    }
  }
}
