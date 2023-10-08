import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersEntity } from 'src/entities/Users.entity';
import { Res } from 'src/models/Res.model';
import { TransferDto } from './dto/transfer.dto';
import { NameEnquiryDto } from './dto/name-enquiry.dto';
import { WalletsService } from '../wallets/wallets.service';
import { UsersService } from '../users/users.service';
import { RES } from 'src/constants/responses';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionStatus } from 'src/enum/TransactionStatus.enum';

@Injectable()
export class TransferService {
  private logger = new Logger('TransferService');

  constructor(
    private walletsService: WalletsService,
    private usersService: UsersService,
    private transactionsService: TransactionsService,
  ) {}

  async transfer(user: UsersEntity, dto: TransferDto): Promise<Res> {
    const { account_to_credit, account_to_debit, amount, transaction_pin } =
      dto;
    if (!user.has_pin) {
      throw new UnauthorizedException(
        'Please set up PIN to perform tranaction',
      );
    }
    await this.usersService.validatePin(user, transaction_pin);
    let transaction = await this.transactionsService.createWalletTransactionLog(
      user,
      {
        account_to_credit,
        account_to_debit,
        amount,
      },
    );
    console.log(transaction);
    await this.walletsService.debitWallet({
      account_to_debit: account_to_debit,
      amount: amount,
    });
    await this.walletsService.creditWallet({
      account_to_credit: account_to_credit,
      amount: amount,
    });
    transaction = await this.transactionsService.updateWalletTransactionLog(
      user,
      transaction.data.id,
      TransactionStatus.SUCCESS,
    );

    const res: Res = RES('TRANSFER_SUCCESSFUL', 'SUCCESS', true, transaction);

    this.logger.debug(
      `User details fetched successfully "id": "${
        user.id
      }", "name": "${await user.fullName()}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    return res;
  }

  async nameEnquiry(user: UsersEntity, dto: NameEnquiryDto): Promise<Res> {
    const res = await this.walletsService.nameEnquiry(dto);
    this.logger.debug(
      `Wallet account request successful for "id": "${
        user.id
      }", "name": "${await user.fullName()}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    return res;
  }
}
