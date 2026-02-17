import { Test, TestingModule } from '@nestjs/testing';
import { GreeterService } from './greeter.service';

describe('GreeterService', () => {
  let service: GreeterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreeterService],
    }).compile();

    service = module.get<GreeterService>(GreeterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
