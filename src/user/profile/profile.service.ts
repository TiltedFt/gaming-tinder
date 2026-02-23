import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async createUserProfile(userDto: CreateUserDto) {
    return this.userService.findOrCreate(userDto);
  }
}
