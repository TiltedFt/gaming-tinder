import { Controller, Inject, UseFilters } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

import {
  Action,
  Ctx,
  Message,
  On,
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
import { SenderParams } from 'src/common/types/telegraf-types';
import { isSupportedLanguage, isValueInEnum } from 'src/common/utils/utils';
import type { BotWizardContext } from 'src/interfaces/context.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ProfileService } from 'src/user/profile/profile.service';
import { UserService } from 'src/user/user.service';
import { Markup } from 'telegraf';
import type { WizardContext } from 'telegraf/scenes';

@Wizard(REGISTRATION_WIZARD_SCENE)
@UseFilters(TelegrafExceptionFilter)
export class RegistrationScene {
  constructor(
    private readonly profileService: ProfileService,
    private readonly i18n: I18nService,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: BotWizardContext) {
    const lang = ctx.from?.language_code
      ? ctx.from?.language_code
      : Language.ENGLISH;

    const isSupported = isSupportedLanguage(lang);

    const message = isSupported
      ? this.i18n.t('registration.language_found', {
          lang,
          args: { language: lang.toUpperCase() },
        })
      : this.i18n.t('registration.language_not_found', { lang: 'en' });
    // make custom components!!!!!!!
    await ctx.reply(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback('🇬🇧 English', 'lang_en')],
        [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
      ]),
    );

    await ctx.wizard.next();
  }

  @Action(/^lang_(.+)$/)
  @WizardStep(2)
  async onLanguageSelected(@Ctx() ctx: BotWizardContext) {
    const lang = (ctx as any).match[1]; // en, ru
    // only for exception filter on this step :)
    ctx.wizard.state['language'] = lang;

    await ctx.answerCbQuery();
    await ctx.reply(this.i18n.t('registration.ask_public_username', { lang }));
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
    publicUsername = publicUsername.trim();

    const isValid = /^[a-zA-Z0-9_.\-]{3,30}$/.test(publicUsername);

    if (!isValid) {
      await ctx.reply(
        this.i18n.t('registration.invalid_public_username', { lang: language }),
      );
      return;
    }

    const data = plainToInstance(CreateUserDto, {
      telegramId,
      publicUsername,
      telegramUsername,
      language,
    });

    const errors = await validate(data);
    if (errors.length) {
      throw new Error();
    }

    const user = await this.registerUser(data);

    ctx.dbUser = user;
    await ctx.reply(this.i18n.t('registration.success', { lang: language }));
    await ctx.scene.enter(MAIN_MENU_SCENE);
  }

  private async registerUser(userDto: CreateUserDto) {
    return await this.profileService.createUserProfile(userDto);
  }
}

/* 
    const errors = await validate(createUserDto);
    @Sender('id') telegramId: number,

    @Sender('username') username: string | undefined,
 */
