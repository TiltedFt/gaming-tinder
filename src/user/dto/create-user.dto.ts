import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Language } from 'src/language/entities/language.entity';

export class CreateUserDto {
  telegramId: number;

  @IsString()
  @Length(3, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^[a-zA-Z0-9_.\-]+$/)
  publicUsername: string;

  telegramUsername: string | null;

  botLanguage: Language;
}
