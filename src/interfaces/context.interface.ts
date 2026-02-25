import { ProfileEditMethods } from 'src/common/constants/app-constants';
import { User } from 'src/user/entities/user.entity';
import { Scenes } from 'telegraf';

interface ProfileSceneState extends Scenes.SceneSessionData {
  editing?: ProfileEditMethods | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext<ProfileSceneState> {
  dbUser: User;
  scene: Scenes.SceneContextScene<Context> & {
    state: {
      editing: ProfileEditMethods | null;
    };
  };
}

export interface BotWizardContext extends Scenes.WizardContext {
  dbUser: User | null;
}
