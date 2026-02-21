import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  createUserProfile(userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  findMeByPublicUsername(publicUsername: string) {
    return this.userService.findByPublicUsername(publicUsername);
  }

  /*  findByTelegramId(telegramId: string): Promise<User | null> {
    return this.repository.findOneBy({ telegramId });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  } */
}
