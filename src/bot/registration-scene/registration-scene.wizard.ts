import { Controller } from '@nestjs/common';

import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { REGISTRATION_WIZARD_SCENE } from 'src/common/app-constants';
import type { WizardContext } from 'telegraf/scenes';

@Wizard(REGISTRATION_WIZARD_SCENE)
export class RegistrationScene {
  // constructor(private readonly registrationSceneService: RegistrationSceneService) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    // tg id, tgUsername
    console.log('Enter to scene');
    return 'Welcome to wizard scene ✋ Send me your name';
  }
}
