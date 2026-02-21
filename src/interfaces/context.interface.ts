import { User } from 'src/user/entities/user.entity';
import { Scenes } from 'telegraf';
import { WizardScene } from 'telegraf/scenes';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext {
  dbUser: User | null;
}

export interface BotWizardContext extends Scenes.WizardContext {
  dbUser: User | null;
}
