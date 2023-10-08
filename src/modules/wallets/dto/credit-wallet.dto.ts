import { IsNumberString } from 'class-validator';

export class CreditWalletDto {
  @IsNumberString()
  account_to_credit: string;

  @IsNumberString()
  amount: string;
}
