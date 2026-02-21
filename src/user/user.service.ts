import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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

  create(createUserDto: CreateUserDto) {
    return this.repository.save(this.repository.create(createUserDto));
  }

  findOneByTelegramId(telegramId: number) {
    return this.repository.findOneBy({ telegramId });
  }
}
