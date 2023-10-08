import { Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/Users.entity';
import { TransactionsEntity } from 'src/entities/Transactions.entity';
import { WalletTransactionLogDto } from 'src/modules/transactions/dto/wallet-transaction-log.dto';
import { TransactionStatus } from 'src/enum/TransactionStatus.enum';
import { TransactionType } from 'src/enum/TransactionType.enum';

@Injectable()
export class TransactionsRepository {
  private logger = new Logger('TransactionsRepository');
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactions: Repository<TransactionsEntity>,
  ) {}

  async createWalletTransactionLog(
    user: UsersEntity,
    dto: WalletTransactionLogDto,
  ): Promise<TransactionsEntity> {
    const { account_to_credit, account_to_debit, amount } = dto;
    const transaction = new TransactionsEntity();
    transaction.account_to_credit = account_to_credit;
    transaction.account_to_debit = account_to_debit;
    transaction.amount = parseFloat(amount);
    transaction.payment_gateway = 'WALLET';
    transaction.payment_mode = 'WALLET';
    transaction.payment_order_id = new Date(Date.now()).getTime().toString();
    transaction.payment_ref = new Date(Date.now()).getTime().toString();
    transaction.transaction_date = new Date();
    transaction.transaction_status = TransactionStatus.PENDING;
    transaction.transaction_type = TransactionType.TRANSFER;
    transaction.user = user;
    try {
      await transaction.save();
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateWalletTransactionLog(
    id: number,
    status: TransactionStatus,
  ): Promise<TransactionsEntity> {
    const transaction = await this.transactions.findOneBy({ id: id });
    transaction.transaction_status = status;
    try {
      await transaction.save();
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
