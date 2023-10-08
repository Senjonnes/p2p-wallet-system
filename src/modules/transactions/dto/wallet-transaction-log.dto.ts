import { IsNumberString } from 'class-validator';

export class WalletTransactionLogDto {
  @IsNumberString()
  amount: string;

  @IsNumberString()
  account_to_credit: string;

  @IsNumberString()
  account_to_debit: string;
}
