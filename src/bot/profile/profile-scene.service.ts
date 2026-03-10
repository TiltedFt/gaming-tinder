import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  ProfileCommands,
  GAME_EDITOR_SCENE,
  MAIN_MENU_SCENE,
  PROFILE_SCENE,
  ProfileEditMethods,
  REGISTRATION_WIZARD_SCENE,
} from 'src/common/constants/app-constants';
import { Markup } from 'telegraf';
import type { Context } from '../../interfaces/context.interface';
import { ProfileCardComponent } from './components/profile-card.component';
import {
  ProfileAction,
  ProfileKeyboardComponent,
} from './components/profile-keyboard.component';
import { UserService } from 'src/user/user.service';
import { UpdateAgeDto, UpdateProfileDto } from 'src/user/dto/update-user.dto';
import { I18nHelper } from 'src/common/helper/i18n-helper/i18n.helper';
import { ProfileGenderKeyboard } from './components/profile-gender-keyboard.component';
import { Gender } from 'src/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { ProfileKey, UserErrorKey } from 'src/i18n/i18n-keys';
import { LanguageService } from 'src/language/language.service';
import { UserSpokenLanguagesKeyboard } from './components/user-spoken-languages.component';

@Scene(PROFILE_SCENE)
@UseFilters(TelegrafExceptionFilter)
export class ProfileSceneService {
  constructor(
    private readonly profileCard: ProfileCardComponent,
    private readonly profileKeyboard: ProfileKeyboardComponent,
    private readonly profileGenderKeyboard: ProfileGenderKeyboard,
    private readonly userSpokenLanguagesKeyboard: UserSpokenLanguagesKeyboard,
    private readonly userService: UserService,
    private readonly i18n: I18nHelper,
    private readonly languagesService: LanguageService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    ctx.scene.state.editing = null;
    ctx.scene.state.profileMessageId = null;
    ctx.scene.state.promptMessageId = null;
    await this.showProfile(ctx);
  }

  private async showProfile(ctx: Context, forceNew = false) {
    const user = await this.userService.findByIdWithGamesAndLanguages(
      ctx.dbUser!.id,
    );
    if (!user) {
      await ctx.scene.enter(REGISTRATION_WIZARD_SCENE);
      return;
    }

    const lang = user.getBotLanguageCode;
    const text = this.profileCard.render(user);
    const keyboard = this.profileKeyboard.render(lang, user.hasMic);

    if (forceNew && user.avatarFileId) {
      try {
        await ctx.replyWithPhoto(user.avatarFileId);
      } catch {
        try {
          await ctx.replyWithVideo(user.avatarFileId);
        } catch {
          await this.userService.updateAndReturn(user.id, {
            avatarFileId: null,
          });
          await ctx.reply(this.i18n.t(ProfileKey.NO_AVATAR, lang));
        }
      }
      const sent = await ctx.reply(text, keyboard);
      ctx.scene.state.profileMessageId = sent.message_id;
      return;
    }

    const messageId = ctx.scene.state.profileMessageId;
    if (messageId && !forceNew) {
      try {
        await ctx.telegram.editMessageText(
          ctx.chat!.id,
          messageId,
          undefined,
          text,
          keyboard,
        );
        return;
      } catch {}
    }

    const sent = await ctx.reply(text, keyboard);
    ctx.scene.state.profileMessageId = sent.message_id;
  }

  private async deletePromptMessage(ctx: Context) {
    const promptId = ctx.scene.state.promptMessageId;
    if (!promptId) return;
    try {
      await ctx.telegram.deleteMessage(ctx.chat!.id, promptId);
    } catch {}
    ctx.scene.state.promptMessageId = null;
  }

  private async deleteUserMessage(ctx: Context) {
    if (!ctx.message) return;
    try {
      await ctx.telegram.deleteMessage(ctx.chat!.id, ctx.message.message_id);
    } catch {}
  }

  @Action(ProfileAction.EDIT_AVATAR)
  async editAvatar(@Ctx() ctx: Context) {
    const lang = ctx.dbUser!.getBotLanguageCode;
    ctx.scene.state.editing = ProfileEditMethods.AVATAR;

    const hasAvatar = !!ctx.dbUser!.avatarFileId;
    const buttons = [
      [
        Markup.button.callback(
          this.i18n.t(ProfileKey.CANCEL_AVATAR_UPLOAD, lang),
          ProfileCommands.CANCEL_AVATAR_UPLOAD,
        ),
      ],
    ];

    if (hasAvatar) {
      buttons.unshift([
        Markup.button.callback(
          this.i18n.t(ProfileKey.REMOVE_AVATAR, lang),
          ProfileAction.REMOVE_AVATAR,
        ),
      ]);
    }

    const sent = await ctx.reply(
      this.i18n.t(ProfileKey.EDIT_AVATAR, lang),
      Markup.inlineKeyboard(buttons),
    );
    ctx.scene.state.promptMessageId = sent.message_id;
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.REMOVE_AVATAR)
  async removeAvatar(@Ctx() ctx: Context) {
    await this.deletePromptMessage(ctx);
    await this.updateAndRefreshUser(ctx, { avatarFileId: null });
    await ctx.answerCbQuery();
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    if (ctx.scene.state.editing !== ProfileEditMethods.AVATAR) return;

    const photos = ctx.message!['photo'];
    const fileId = photos[photos.length - 1].file_id;

    await this.deletePromptMessage(ctx);
    await this.updateAndRefreshUser(ctx, { avatarFileId: fileId }, true);
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context) {
    if (ctx.scene.state.editing !== ProfileEditMethods.AVATAR) return;

    const fileId = ctx.message!['video'].file_id;
    await this.deletePromptMessage(ctx);
    await this.updateAndRefreshUser(ctx, { avatarFileId: fileId }, true);
  }

  @Action(ProfileCommands.CANCEL_AVATAR_UPLOAD)
  async cancelAvatarUpload(@Ctx() ctx: Context) {
    ctx.scene.state.editing = null;
    await this.deletePromptMessage(ctx);
    await this.showProfile(ctx);
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_DESCRIPTION)
  async editDescription(@Ctx() ctx: Context) {
    ctx.scene.state.editing = ProfileEditMethods.DESCRIPTION;
    const sent = await ctx.reply(
      this.i18n.t(ProfileKey.EDIT_DESCRIPTION, ctx.dbUser.getBotLanguageCode),
    );
    ctx.scene.state.promptMessageId = sent.message_id;
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_AGE)
  async editAge(@Ctx() ctx: Context) {
    ctx.scene.state.editing = ProfileEditMethods.AGE;
    const sent = await ctx.reply(
      this.i18n.t(ProfileKey.EDIT_AGE, ctx.dbUser.getBotLanguageCode),
    );
    ctx.scene.state.promptMessageId = sent.message_id;
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_COMMUNICATION)
  async editCommunication(@Ctx() ctx: Context) {
    ctx.scene.state.editing = ProfileEditMethods.COMMUNICATION;
    const sent = await ctx.reply(
      this.i18n.t(ProfileKey.EDIT_COMMUNICATION, ctx.dbUser.getBotLanguageCode),
    );
    ctx.scene.state.promptMessageId = sent.message_id;
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_GENDER)
  async editGender(@Ctx() ctx: Context) {
    const lang = ctx.dbUser!.getBotLanguageCode;
    const sent = await ctx.reply(
      this.i18n.t(ProfileKey.EDIT_GENDER, lang),
      this.profileGenderKeyboard.render(lang),
    );
    ctx.scene.state.promptMessageId = sent.message_id;
    await ctx.answerCbQuery();
  }

  @Action([Gender.FEMALE, Gender.MALE, Gender.OTHER])
  async onGenderSelected(@Ctx() ctx: Context) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const gender = ctx.callbackQuery.data as Gender;
    try {
      await ctx.deleteMessage();
    } catch {}
    ctx.scene.state.promptMessageId = null;

    const updatedUser = await this.userService.updateAndReturn(ctx.dbUser.id, {
      gender,
    });
    if (!updatedUser) {
      return await ctx.scene.enter(REGISTRATION_WIZARD_SCENE);
    }
    ctx.dbUser = updatedUser;
    await this.showProfile(ctx);
    await ctx.answerCbQuery();
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    if (!('text' in ctx.message!)) return;
    const text = ctx.message.text;

    const { editing } = ctx.scene.state;
    if (!editing) return;

    switch (editing) {
      case ProfileEditMethods.DESCRIPTION:
        await this.deletePromptMessage(ctx);
        await this.deleteUserMessage(ctx);
        await this.updateAndRefreshUser(ctx, { description: text });
        break;
      case ProfileEditMethods.AGE: {
        const dto = plainToInstance(UpdateAgeDto, { age: Number(text) });
        const errors = await validate(dto);
        if (errors.length) {
          await ctx.reply(
            this.i18n.t(
              UserErrorKey.INVALID_AGE,
              ctx.dbUser.getBotLanguageCode,
            ),
          );
          return;
        }
        await this.deletePromptMessage(ctx);
        await this.deleteUserMessage(ctx);
        await this.updateAndRefreshUser(ctx, { age: dto.age });
        break;
      }
      case ProfileEditMethods.COMMUNICATION:
        await this.deletePromptMessage(ctx);
        await this.deleteUserMessage(ctx);
        await this.updateAndRefreshUser(ctx, {
          preferredCommunicationWay: text,
        });
        break;
    }
  }

  @Action(ProfileAction.EDIT_MIC)
  async editMic(@Ctx() ctx: Context) {
    const newValue = !ctx.dbUser.hasMic;
    await this.updateAndRefreshUser(ctx, { hasMic: newValue });
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_GAMES)
  async editGames(@Ctx() ctx: Context) {
    await ctx.scene.enter(GAME_EDITOR_SCENE);
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_SPOKEN_LANGUAGES)
  async getLanguages(@Ctx() ctx: Context) {
    const languages = await this.languagesService.getAllWithSelection({
      nativeName: true,
      id: true,
    });

    const userLangs = await this.userService.getSpokenLanguageIds(
      ctx.dbUser.id,
    );

    const keyboard = this.userSpokenLanguagesKeyboard.render(
      languages,
      userLangs,
      ctx.dbUser.getBotLanguageCode,
    );

    await ctx.reply(
      this.i18n.t(
        ProfileKey.CHOOSE_SPOKEN_LANGUAGES,
        ctx.dbUser.getBotLanguageCode,
      ),
      keyboard,
    );
    await ctx.answerCbQuery();
  }

  @Action(/^spokenlang_([0-9a-f-]+)$/i)
  async onLanguageToggle(@Ctx() ctx: Context) {
    const langId = (ctx.callbackQuery as any).data.replace('spokenlang_', '');
    await this.userService.toggleSpokenLanguage(ctx.dbUser.id, langId);

    const languages = await this.languagesService.getAllWithSelection({
      nativeName: true,
      id: true,
    });

    const userLangs = await this.userService.getSpokenLanguageIds(
      ctx.dbUser.id,
    );

    const keyboard = this.userSpokenLanguagesKeyboard.render(
      languages,
      userLangs,
      ctx.dbUser.getBotLanguageCode,
    );

    await ctx.editMessageReplyMarkup(keyboard.reply_markup);
    await ctx.answerCbQuery();
  }

  @Action('spokenlang_done')
  async onLanguagesDone(@Ctx() ctx: Context) {
    await ctx.deleteMessage();
    await this.showProfile(ctx);
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.GO_MAIN_MENU)
  async goToMainMenu(@Ctx() ctx: Context) {
    await ctx.scene.enter(MAIN_MENU_SCENE);
    await ctx.answerCbQuery();
  }

  private async updateAndRefreshUser(
    ctx: Context,
    data: UpdateProfileDto,
    forceNew = false,
  ) {
    const updatedUser = await this.userService.updateAndReturn(
      ctx.dbUser!.id,
      data,
    );
    if (!updatedUser) {
      return await ctx.scene.enter(REGISTRATION_WIZARD_SCENE);
    }
    ctx.dbUser = updatedUser;
    ctx.scene.state.editing = null;
    await this.showProfile(ctx, forceNew);
  }
}
