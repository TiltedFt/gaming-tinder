
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';

import { UserModule } from './user/user.module';
import { GreeterModule } from './greeter/greeter.module';
import { session } from 'telegraf';
import { GreeterUpdate } from './greeter/greeter.update';

@Module({
  imports: [
    ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true
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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('BOT_TOKEN')!,
        middlewares: [session()],
        include: [GreeterModule]
      }),
    }),
    UserModule,
    GreeterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }