import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty() @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional() @IsString()
  password?: string;
}
