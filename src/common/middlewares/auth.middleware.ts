import { UserService } from 'src/user/user.service';
import { REGISTRATION_WIZARD_SCENE } from '../constants/app-constants';

export function createAuthMiddleware(userService: UserService) {
  return async (ctx, next) => {
    if (!ctx.dbUser && ctx.from?.id) {
      ctx.dbUser = await userService.findByTelegramId(ctx.from.id);
    }

    if (ctx.dbUser) return next();

    const text = (ctx as any).message?.text;
    const isStart = text === '/start';
    const isInRegistration =
      (ctx as any).session?.__scenes?.current === REGISTRATION_WIZARD_SCENE;

    if (isStart || isInRegistration) return next();

    await ctx.reply(
      'Please use /start to register.\nНажмите /start для регистрации.',
    );
  };
}
