import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { PublicUsernameTakenError } from 'src/common/errors/public-username-taken.error';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async createUserProfile(userDto: CreateUserDto) {
    const user = await this.userService.findByPublicUsername(
      userDto.publicUsername,
    );

    if (user) {
      throw new PublicUsernameTakenError(userDto.publicUsername);
    }

    return this.userService.create(userDto);
  }
}
