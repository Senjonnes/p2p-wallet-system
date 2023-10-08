import { IsNumberString } from 'class-validator';

export class DebitWalletDto {
  @IsNumberString()
  account_to_debit: string;

  @IsNumberString()
  amount: string;
}
