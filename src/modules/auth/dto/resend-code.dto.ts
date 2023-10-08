import { IsEmail } from 'class-validator';

export class ResendCodeDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
