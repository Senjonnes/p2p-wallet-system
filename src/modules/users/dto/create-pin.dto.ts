import { IsNumberString, MaxLength, MinLength } from 'class-validator';

export class CreatePinDto {
  @IsNumberString()
  @MinLength(4)
  @MaxLength(4)
  pin: string;

  @IsNumberString()
  @MinLength(4)
  @MaxLength(4)
  confirm_pin: string;
}
