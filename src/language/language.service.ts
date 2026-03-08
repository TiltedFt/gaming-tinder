import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService implements OnModuleInit {
  @InjectRepository(Language)
  private readonly repository: Repository<Language>;

  async onModuleInit() {
    const seeds = [
      { code: 'en', nativeName: '🇬🇧 English', isBotSupported: true },
      { code: 'ru', nativeName: '🇷🇺 Русский', isBotSupported: true },
    ];

    for (const seed of seeds) {
      await this.repository.upsert(seed, ['code']);
    }
  }

  getBotsLanguages() {
    return this.repository.findBy({ isBotSupported: true });
  }

  findBotsLanguageByCode(code: string) {
    return this.repository.findOneBy({ isBotSupported: true, code });
  }
}
