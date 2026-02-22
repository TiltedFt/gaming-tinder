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
import { REGISTRATION_WIZARD_SCENE } from 'src/common/app-constants';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { SenderParams } from 'src/common/telegraf-types';
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
    const lang = ctx.from?.language_code;
    const supportedLanguages = ['en', 'ru'];
    const isSupported = lang && supportedLanguages.includes(lang);

    const message = isSupported
      ? this.i18n.t('registration.language_found', {
          lang,
          args: { language: lang.toUpperCase() },
        })
      : this.i18n.t('registration.language_not_found', { lang: 'en' });

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
    const lang = ctx.wizard.state['language'];
    publicUsername = publicUsername.trim();

    const isValid = /^[a-zA-Z0-9_.\-]{3,30}$/.test(publicUsername);

    if (!isValid) {
      await ctx.reply(
        this.i18n.t('registration.invalid_public_username', { lang }),
      );
      return;
    }

    const data = plainToInstance(CreateUserDto, {
      telegramId: ctx.from,
      publicUsername: publicUsername,
      telegramUsername: telegramUsername,
      language: lang,
    });
    const user = await this.registerUser(data);
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
