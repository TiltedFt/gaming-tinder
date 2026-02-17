import { Command, Ctx, Hears, Start, Update, Sender } from 'nestjs-telegraf';
import type { Context } from '../interfaces/context.interface';
import { GetUpdateType } from 'src/common/decorators/get-update-type.decorator';
import type { UpdateType } from 'src/common/telegraf-types';

@Update()
export class GreeterUpdate {
  @Start()
  onStart(): string {
    return 'Hello, im this and that bot';
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  onGreetings(
    @GetUpdateType() updateType: UpdateType,
    @Sender('first_name') firstName: string,
  ): string {
    return `Hey ${firstName}`;
  }

  @Command('scene')
  async onSceneCommand(@Ctx() ctx: Context): Promise<string> {
    return "scene command"
  }

  @Command('wizard')
  async onWizardCommand(@Ctx() ctx: Context): Promise<string> {
    return "wiazrd command"
  }
}