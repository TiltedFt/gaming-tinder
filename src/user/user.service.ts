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

  findByIdWithGames(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['games'],
    });
  }
}
