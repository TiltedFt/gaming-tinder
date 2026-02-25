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
      if (text && globalCommands.includes(text)) {
        const session = (ctx as any).session;
        if (session?.__scenes?.current) {
          session.__scenes = {};
        }
      }
      return next();
    }

    const text = (ctx as any).message?.text;
    const isStart = text === `/${BotCommand.START}`;
    const isInRegistration =
      (ctx as any).session?.__scenes?.current === REGISTRATION_WIZARD_SCENE;

    if (isStart || isInRegistration) return next();

    await ctx.reply(
      'Please use /start to register.\nНажмите /start для регистрации.',
    );
  };
}
