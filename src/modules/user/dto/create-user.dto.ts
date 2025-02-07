import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsPhoneNumber('TH')
  @IsOptional()
  Telephone_number?: string;

  @IsOptional()
  @IsString()
  refresh_token?: string;
}
