import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly config: ConfigService) {}

  @Get()
  getHello(): string {
    console.log(this.config.get<string>('POSTGRES_HOST'))
    return this.appService.getHello();
  }
}
