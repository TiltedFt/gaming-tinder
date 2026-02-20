import { Test, TestingModule } from '@nestjs/testing';
import { GamingPlatformService } from './gaming-platform.service';

describe('GamingPlatformService', () => {
  let service: GamingPlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamingPlatformService],
    }).compile();

    service = module.get<GamingPlatformService>(GamingPlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
