import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  telegramId: number;

  @IsString()
  @Length(3, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^[a-zA-Z0-9_.\-]+$/)
  publicUsername: string;

  telegramUsername: string | null;

  @IsString()
  @IsNotEmpty()
  botLanguageCode: string;
}
