import { Test, TestingModule } from '@nestjs/testing';
import { MainMenuSceneController } from './main-menu-scene.controller';
import { MainMenuSceneService } from './main-menu-scene.service';

describe('MainMenuSceneController', () => {
  let controller: MainMenuSceneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainMenuSceneController],
      providers: [MainMenuSceneService],
    }).compile();

    controller = module.get<MainMenuSceneController>(MainMenuSceneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
