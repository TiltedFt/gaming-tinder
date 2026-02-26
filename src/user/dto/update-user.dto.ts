import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Gender } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  description?: string;
  age?: number | null;
  avatarFileId?: string | null;
  preferredCommunicationWay?: string;
  gender?: Gender;
  hasMic?: boolean;
}
