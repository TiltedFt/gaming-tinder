import { ProfileEditMethods } from 'src/common/constants/app-constants';
import { User } from 'src/user/entities/user.entity';
import { Scenes } from 'telegraf';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext<Scenes.SceneSessionData> {
  dbUser: User;
  scene: Scenes.SceneContextScene<Context> & {
    state: {
      editing: ProfileEditMethods | null;
      gameEditorStep?: string | null;
      gamePage?: number;
      lastSearchResults?: string[];
      lastSearchQuery: string | undefined;
    };
  };
}

export interface BotWizardContext extends Scenes.WizardContext {
  dbUser: User | null;
}
