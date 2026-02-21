import { IsString, Length, IsOptional } from 'class-validator';

export class CreateUserDto {
  telegramId: number;

  @IsOptional()
  @IsString()
  @Length(3, 30)
  publicUsername: string;

  telegramUsername: string | null;
  language: string;
}
