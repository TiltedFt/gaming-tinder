import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  getViolationDetail,
  isUniqueViolation,
} from 'src/common/utils/pg-error';
import { PublicUsernameTakenError } from 'src/common/errors/public-username-taken.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  findByTelegramId(telegramId: number): Promise<User | null> {
    return this.repository.findOneBy({ telegramId: telegramId });
  }

  findByPublicUsername(publicUsername: string) {
    return this.repository.findOneBy({ publicUsername });
  }

  async findOrCreate(dto: CreateUserDto): Promise<User> {
    try {
      await this.repository.upsert(dto, ['telegramId']);
      return this.findByTelegramId(dto.telegramId) as Promise<User>;
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
}
