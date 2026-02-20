import { Test, TestingModule } from '@nestjs/testing';
import { MainMenuSceneService } from './main-menu-scene.service';

describe('MainMenuSceneService', () => {
  let service: MainMenuSceneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainMenuSceneService],
    }).compile();

    service = module.get<MainMenuSceneService>(MainMenuSceneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
