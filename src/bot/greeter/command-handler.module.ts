import { Module } from '@nestjs/common';
import { CommandHandler } from './command-handler.update';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [CommandHandler],
  imports: [UserModule],
})
export class CommandHandlerModule {}
