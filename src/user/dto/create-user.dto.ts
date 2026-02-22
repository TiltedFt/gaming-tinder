import { IsString, Length } from 'class-validator';
import { Language } from 'src/common/constants/supported-language';

export class CreateUserDto {
  telegramId: number;

  @IsString()
  @Length(3, 30)
  publicUsername: string;

  telegramUsername: string | null;

  language: Language;
}
