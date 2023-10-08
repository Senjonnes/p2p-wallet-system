import { IsNumberString, MaxLength, MinLength } from 'class-validator';

export class TransferDto {
  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  account_to_credit: string;

  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  account_to_debit: string;

  @IsNumberString()
  amount: string;

  @IsNumberString()
  @MinLength(4)
  @MaxLength(4)
  transaction_pin: string;
}
