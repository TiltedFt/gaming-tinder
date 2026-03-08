import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from './user/user.module';
import { session } from 'telegraf';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { BotModule } from './bot/bot.module';
import { GameModule } from './game/game.module';
import { Postgres } from '@telegraf/session/pg';
import { UserService } from './user/user.service';
import { createAuthMiddleware } from './common/middlewares/auth.middleware';
import { I18nHelperModule } from './common/helper/i18n-helper/i18n-helper.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: config.get<boolean>('DATABASE_SYNCHRONIZE'),
      }),
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule, UserModule],
      inject: [ConfigService, UserService],
      useFactory: (config: ConfigService, userService: UserService) => ({
        token: config.get<string>('BOT_TOKEN')!,
        middlewares: [
          session({
            // this connection is to store session automatically
            store: Postgres({
              host: config.get('DATABASE_HOST'),
              port: config.get<number>('DATABASE_PORT'),
              database: config.get('DATABASE_NAME'),
              user: config.get('DATABASE_USER'),
              password: config.get('DATABASE_PASSWORD'),
            }),
          }),

          createAuthMiddleware(userService),
        ],
        include: [BotModule],
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: true,
      },
      /* resolvers: [
        new QueryResolver(['lang']), // ?lang=ru for web
        new AcceptLanguageResolver(), // Accept-Language header
      ], */
    }),
    I18nHelperModule,
    UserModule,
    BotModule,
    GameModule,
    LanguageModule,
  ],
})
export class AppModule {}
