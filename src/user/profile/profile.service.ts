import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async createUserProfile(userDto: CreateUserDto) {
    const user = await this.userService.findByPublicUsername(
      userDto.publicUsername,
    );
    if (user) {
      throw new Error();
    }
    return this.userService.create(userDto);
  }

  findMeByPublicUsername(publicUsername: string) {
    return this.userService.findByPublicUsername(publicUsername);
  }
}
