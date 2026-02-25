import { Module } from '@nestjs/common';
import { CommandHandler } from './command-handler.update';

@Module({
  providers: [CommandHandler],
})
export class CommandHandlerModule {}
