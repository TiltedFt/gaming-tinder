import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';
import { BotCommand } from './common/constants/app-constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const bot = app.get(getBotToken());

  const commands = {
    en: [
      { command: BotCommand.START, description: 'Start the bot' },
      { command: BotCommand.MENU, description: 'Main menu' },
      { command: BotCommand.PROFILE, description: 'My profile' },
      { command: BotCommand.SEARCH, description: 'Find teammates' },
      { command: BotCommand.HELP, description: 'Help' },
    ],
    ru: [
      { command: BotCommand.START, description: 'Запустить бота' },
      { command: BotCommand.MENU, description: 'Главное меню' },
      { command: BotCommand.PROFILE, description: 'Мой профиль' },
      { command: BotCommand.SEARCH, description: 'Найти тиммейтов' },
      { command: BotCommand.HELP, description: 'Помощь' },
    ],
  };

  await bot.telegram.setMyCommands(commands.en);
  await bot.telegram.setMyCommands(commands.en, { language_code: 'en' });
  await bot.telegram.setMyCommands(commands.ru, { language_code: 'ru' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
