import { Module } from '@nestjs/common';
import { CommandHandler } from './command-handler.update';
import { LanguageModule } from 'src/language/language.module';

@Module({
  imports: [LanguageModule],
  providers: [CommandHandler],
})
export class CommandHandlerModule {}
