import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsString, Length } from 'class-validator';
import { Language } from 'src/common/constants/supported-language';

export class CreateUserDto {
  telegramId: number;

  @IsString()
  @Length(3, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  publicUsername: string;

  telegramUsername: string | null;

  @IsEnum(Language)
  language: Language;
}
