import { Module } from '@nestjs/common';
import { GreeterUpdate } from './greeter.update';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [GreeterUpdate],
  imports: [UserModule]
})
export class GreeterModule {}
