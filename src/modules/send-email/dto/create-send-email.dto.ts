import { IsEmail, IsString } from 'class-validator';

export class CreateSendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;
}
