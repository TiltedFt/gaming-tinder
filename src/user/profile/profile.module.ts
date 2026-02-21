import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserModule } from '../user.module';

@Module({
  providers: [ProfileService],
  imports: [UserModule],
  exports: [ProfileService],
})
export class ProfileModule {}
