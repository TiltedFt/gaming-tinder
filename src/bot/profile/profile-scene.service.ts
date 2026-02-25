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
import { Gender, User } from 'src/user/entities/user.entity';

@Scene(PROFILE_SCENE)
export class ProfileSceneService {
  constructor(
    private readonly profileCard: ProfileCardComponent,
    private readonly profileKeyboard: ProfileKeyboardComponent,
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const user = ctx.dbUser!;
    const lang = user.language;

    if (user.avatarFileId) {
      await ctx.replyWithPhoto(user.avatarFileId, {
        caption: this.profileCard.render(user),
        ...this.profileKeyboard.render(lang),
      });
    } else {
      await ctx.editMessageText(
        this.profileCard.render(user),
        this.profileKeyboard.render(lang),
      );
    }
  }

  @Action(ProfileAction.EDIT_DESCRIPTION)
  async editDescription(@Ctx() ctx: Context) {
    ctx.scene.state.editing = ProfileEditMethods.DESCRIPTION;
    await ctx.reply('Enter description, keep it short');
    await ctx.answerCbQuery();
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const ctxUser = ctx.dbUser;

    const { editing } = ctx.scene.state;
    if (!editing) {
      return;
    }
    if (editing === 'description') {
      const updatedUser = await this.userService.updateAndReturn(ctxUser.id, {
        description: 'hello',
      });
    }
  }
}

//    await ctx.answerCbQuery();
