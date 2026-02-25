import { Action, Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import {
  PROFILE_SCENE,
  ProfileEditMethods,
} from 'src/common/constants/app-constants';

import type { Context } from '../../interfaces/context.interface';
import { ProfileCardComponent } from './components/profile-card.component';
import {
  ProfileAction,
  ProfileKeyboardComponent,
} from './components/profile-keyboard.component';
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nKey } from 'src/i18n/i18n-keys';
import { ProfileGenderKeyboard } from './components/profile-gender-keyboard.component';
import { Gender } from 'src/user/entities/user.entity';

@Scene(PROFILE_SCENE)
export class ProfileSceneService {
  constructor(
    private readonly profileCard: ProfileCardComponent,
    private readonly profileKeyboard: ProfileKeyboardComponent,
    private readonly profileGenderKeyboard: ProfileGenderKeyboard,
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.refreshProfile(ctx, true);
  }

  private async refreshProfile(ctx: Context, canEdit = false) {
    const user = ctx.dbUser!;
    const text = this.profileCard.render(user);
    const keyboard = this.profileKeyboard.render(user.botLanguage);

    if (user.avatarFileId) {
      await ctx.replyWithPhoto(user.avatarFileId, {
        caption: text,
        ...keyboard,
      });
      return;
    }

    if (canEdit) {
      try {
        await ctx.editMessageText(text, keyboard);
      } catch {
        await ctx.reply(text, keyboard);
      }
    } else {
      await ctx.reply(text, keyboard);
    }
  }

  @Action(ProfileAction.EDIT_DESCRIPTION)
  async editDescription(@Ctx() ctx: Context) {
    ctx.scene.state.editing = ProfileEditMethods.DESCRIPTION;
    await ctx.reply(this.i18n.t(I18nKey.PROFILE_EDIT_DESCRIPTION));
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_AGE)
  async editAge(@Ctx() ctx: Context) {
    ctx.scene.state.editing = ProfileEditMethods.AGE;
    await ctx.reply(this.i18n.t(I18nKey.PROFILE_EDIT_AGE));
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_COMMUNICATION)
  async editCommunication(@Ctx() ctx: Context) {
    ctx.scene.state.editing = ProfileEditMethods.COMMUNICATION;
    await ctx.reply(this.i18n.t(I18nKey.PROFILE_EDIT_COMMUNICATION));
    await ctx.answerCbQuery();
  }

  @Action(ProfileAction.EDIT_GENDER)
  async editGender(@Ctx() ctx: Context) {
    await ctx.reply(
      this.i18n.t(I18nKey.PROFILE_EDIT_GENDER) as string,
      this.profileGenderKeyboard.render(ctx.dbUser!.botLanguage),
    );
    await ctx.answerCbQuery();
  }

  @Action([Gender.FEMALE, Gender.MALE, Gender.OTHER])
  async onGenderSelected(@Ctx() ctx: Context) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const gender = ctx.callbackQuery.data as Gender;
    ctx.dbUser = await this.userService.updateAndReturn(ctx.dbUser!.id, {
      gender,
    });

    await this.refreshProfile(ctx, true);
    await ctx.answerCbQuery();
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    if (!('text' in ctx.message!)) return;
    const text = ctx.message.text;
    if (text.startsWith('/')) return;

    const { editing } = ctx.scene.state;
    if (!editing) return;
    // type safety

    switch (editing) {
      case ProfileEditMethods.DESCRIPTION:
        await this.updateAndRefreshUser(ctx, { description: text });
        break;
      case ProfileEditMethods.AGE: {
        const age = Math.abs(Number(text));
        if (isNaN(age) || age > 99) {
          await ctx.reply(
            this.i18n.t(I18nKey.PROFILE_INVALID_AGE, {
              lang: ctx.dbUser!.botLanguage,
            }) as string,
          );
          return;
        }
        await this.updateAndRefreshUser(ctx, { age });
        break;
      }
      case ProfileEditMethods.COMMUNICATION:
        await this.updateAndRefreshUser(ctx, {
          preferredCommunicationWay: text,
        });
        break;
    }
  }

  private async updateAndRefreshUser(ctx: Context, data: UpdateUserDto) {
    ctx.dbUser = await this.userService.updateAndReturn(ctx.dbUser!.id, data);
    ctx.scene.state.editing = null;
    await this.refreshProfile(ctx, false);
  }
}

//    await ctx.answerCbQuery();
//    await ctx.answerCbQuery('Error!', { show_alert: true });
