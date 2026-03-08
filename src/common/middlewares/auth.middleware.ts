import { UserService } from 'src/user/user.service';
import {
  BotCommand,
  REGISTRATION_WIZARD_SCENE,
} from '../constants/app-constants';

export function createAuthMiddleware(userService: UserService) {
  const globalCommands = Object.values(BotCommand).map((cmd) => `/${cmd}`);

  return async (ctx, next) => {
    if (ctx.from?.id) {
      ctx.dbUser = await userService.findByTelegramId(ctx.from.id);
    }

    if (ctx.dbUser) {
      const text = (ctx as any).message?.text;
      const command = text?.split(' ')[0];
      // reset the current scene in case he wants to leave using command
      if (command && globalCommands.includes(command)) {
        const session = (ctx as any).session;
        if (session?.__scenes?.current) {
          session.__scenes = {};
        }
      }
      return next();
    }

    // dont let him leave registration scene or he is in menu already
    const text = (ctx as any).message?.text;
    const isStart = text?.split(' ')[0] === `/${BotCommand.START}`;
    const isInRegistration =
      (ctx as any).session?.__scenes?.current === REGISTRATION_WIZARD_SCENE;
    const isCallbackQuery = !!(ctx as any).callbackQuery;
    
    if (isStart || isInRegistration || isCallbackQuery) return next();

    await ctx.reply(
      'Please use /start to register.\nНажмите /start для регистрации.',
    );
  };
}
