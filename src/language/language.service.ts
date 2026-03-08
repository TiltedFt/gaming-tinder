import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  @InjectRepository(Language)
  private readonly repository: Repository<Language>;

  getBotsLanguages() {
    return this.repository.findBy({ isBotSupported: true });
  }

  findBotsLanguageByCode(code: string) {
    return this.repository.findOneBy({ isBotSupported: true, code });
  }
}
