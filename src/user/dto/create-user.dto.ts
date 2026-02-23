import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsString, Length, Matches } from 'class-validator';
import { Language } from 'src/common/constants/supported-language';

export class CreateUserDto {
  telegramId: number;

  @IsString()
  @Length(3, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^[a-zA-Z0-9_.\-]+$/)
  publicUsername: string;

  telegramUsername: string | null;

  @IsEnum(Language)
  language: Language;
}
