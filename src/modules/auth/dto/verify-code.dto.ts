import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  code: string;
}
