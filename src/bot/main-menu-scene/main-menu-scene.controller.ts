import { Controller } from '@nestjs/common';
import { MainMenuSceneService } from './main-menu-scene.service';

@Controller()
export class MainMenuSceneController {
  constructor(private readonly mainMenuSceneService: MainMenuSceneService) {}
}
