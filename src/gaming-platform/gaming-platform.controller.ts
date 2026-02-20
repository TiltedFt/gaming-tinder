import { Controller } from '@nestjs/common';
import { GamingPlatformService } from './gaming-platform.service';

@Controller()
export class GamingPlatformController {
  constructor(private readonly gamingPlatformService: GamingPlatformService) {}
}
