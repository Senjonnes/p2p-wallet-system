import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A password must contain at least contains one numeric digit, one supercase char and one lowercase char',
  })
  password: string;

  @IsBoolean()
  is_terms_condition_checked: boolean;
}
