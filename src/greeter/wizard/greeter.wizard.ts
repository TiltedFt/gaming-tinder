import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { GREETER_WIZARD_SCENE } from 'src/common/app-constants';
import type { WizardContext } from 'telegraf/scenes';

@Wizard(GREETER_WIZARD_SCENE)
export class GreeterWizard {
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    console.log('Enter to scene');
    await ctx.wizard.next();
    return 'Welcome to wizard scene ✋ Send me your name';
  }
}