import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Gender } from '../entities/user.entity';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateProfileDto {
  description?: string;
  age?: number | null;
  avatarFileId?: string | null;
  preferredCommunicationWay?: string;
  gender?: Gender;
  hasMic?: boolean;
}

export class UpdateAgeDto {
  @IsInt()
  @Min(1)
  @Max(99)
  age: number;
}
