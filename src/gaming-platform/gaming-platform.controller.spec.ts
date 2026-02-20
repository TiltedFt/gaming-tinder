import { Test, TestingModule } from '@nestjs/testing';
import { GamingPlatformController } from './gaming-platform.controller';
import { GamingPlatformService } from './gaming-platform.service';

describe('GamingPlatformController', () => {
  let controller: GamingPlatformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamingPlatformController],
      providers: [GamingPlatformService],
    }).compile();

    controller = module.get<GamingPlatformController>(GamingPlatformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
