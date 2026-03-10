import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  getViolationDetail,
  isUniqueViolation,
} from 'src/common/utils/pg-error';
import { PublicUsernameTakenError } from 'src/common/errors/public-username-taken.error';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async updateAndReturn(id: string, data: Partial<UpdateProfileDto>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findByTelegramId(telegramId: number): Promise<User | null> {
    return this.repository.findOneBy({ telegramId });
  }

  findByPublicUsername(publicUsername: string) {
    return this.repository.findOneBy({ publicUsername });
  }

  async findOrCreate(dto: CreateUserDto): Promise<User> {
    const existing = await this.findByTelegramId(dto.telegramId);
    if (existing) return existing;

    try {
      const user = this.repository.create({
        telegramId: dto.telegramId,
        publicUsername: dto.publicUsername,
        telegramUsername: dto.telegramUsername,
        botLanguage: dto.botLanguage,
      });
      return await this.repository.save(user);
    } catch (error) {
      if (
        isUniqueViolation(error) &&
        getViolationDetail(error).includes('publicUsername')
      ) {
        throw new PublicUsernameTakenError(dto.publicUsername);
      }
      throw error;
    }
  }

  findByIdWithGames(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['games'],
    });
  }
  async getSpokenLanguageIds(userId: string): Promise<string[]> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: { spokenLanguages: true },
      select: { id: true, spokenLanguages: { id: true } },
    });
    return user?.spokenLanguages.map((l) => l.id) ?? [];
  }

  async toggleSpokenLanguage(userId: string, langId: string) {
    const user = await this.repository.findOneBy({ id: userId });
    if (!user) return;

    const current = await this.getSpokenLanguageIds(userId);
    const relation = this.repository
      .createQueryBuilder()
      .relation(User, 'spokenLanguages')
      .of(user.id);

    if (current.includes(langId)) {
      await relation.remove(langId);
    } else {
      await relation.add(langId);
    }
  }
}
