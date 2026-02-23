import { Controller, Inject, UseFilters } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

import {
  Action,
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
import { ProfileService } from 'src/user/profile/profile.service';
import { languageKeyboard } from './components/language-keyboard.component';
import { I18nKey } from 'src/i18n/i18n-keys';
import { PublicUsernameTakenError } from 'src/common/errors/public-username-taken.error';

@Wizard(REGISTRATION_WIZARD_SCENE)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationScene {
  constructor(
    private readonly profileService: ProfileService,
    private readonly i18n: I18nService,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: BotWizardContext) {
    const lang = this.detectLanguage(ctx);
    const message = this.getLanguagePrompt(lang);
    await ctx.reply(message, languageKeyboard());
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

  

  @Action(/^lang_(.+)$/)
  @WizardStep(2)
  async onLanguageSelected(@Ctx() ctx: BotWizardContext) {
    const lang = (ctx as any).match[1]; // en, ru
    // only for exception filter on this step :)
    ctx.wizard.state['language'] = lang;

    await ctx.answerCbQuery();
    await ctx.reply(this.i18n.t(I18nKey.ASK_PUBLIC_USERNAME, { lang }));
    await ctx.wizard.next();
  }

  @WizardStep(3)
  async onPublicUsername(
    @Ctx() ctx: BotWizardContext,
    @Message('text') publicUsername: string,
    @Sender('id') telegramId: number,
    @Sender('username') telegramUsername: string | undefined,
  ) {
    const language = ctx.wizard.state['language'];

    if (publicUsername == '/start') {
      return;
    }

    const data = this.createDtoInstance(
      telegramId,
      publicUsername,
      telegramUsername,
      language,
    );

    const errors = await validate(data);
    if (errors.length) {
      await ctx.reply(
        this.i18n.t(I18nKey.INVALID_PUBLIC_USERNAME, {
          lang: language,
        }),
      );

      return;
    }

    try {
      const user = await this.registerUser(data);

      ctx.dbUser = user;
      await ctx.reply(
        this.i18n.t(I18nKey.REGISTRATION_SUCCESS, { lang: language }),
      );
      await ctx.scene.enter(MAIN_MENU_SCENE);
    } catch (error) {
      if (error instanceof PublicUsernameTakenError) {
        await ctx.reply(
          this.i18n.t(I18nKey.USERNAME_TAKEN, {
            lang: language,
          }),
        );

        return;
      }
      throw error;
    }
  }

  private createDtoInstance(
    telegramId: number,
    publicUsername: string,
    telegramUsername: string | undefined,
    language: Language,
  ) {
    return plainToInstance(CreateUserDto, {
      telegramId,
      publicUsername,
      telegramUsername,
      language,
    });
  }

  private async registerUser(userDto: CreateUserDto) {
    return await this.profileService.createUserProfile(userDto);
  }
}
