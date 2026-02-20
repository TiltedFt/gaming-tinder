import { Module } from '@nestjs/common';
import { GamingPlatformService } from './gaming-platform.service';
import { GamingPlatformController } from './gaming-platform.controller';
import { GamingPlatform } from './entity/gaming-platform.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GamingPlatformController],
  providers: [GamingPlatformService],
  imports: [TypeOrmModule.forFeature([GamingPlatform])],
})
export class GamingPlatformModule {}
