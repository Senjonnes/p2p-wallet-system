import { Injectable, Logger } from '@nestjs/common';
import { TransactionsRepository } from 'src/repositories/Transactions.repository';
import { WalletTransactionLogDto } from './dto/wallet-transaction-log.dto';
import { Res } from 'src/models/Res.model';
import { RES } from 'src/constants/responses';
import { UsersEntity } from 'src/entities/Users.entity';
import { TransactionStatus } from 'src/enum/TransactionStatus.enum';

@Injectable()
export class TransactionsService {
  private logger = new Logger('TransactionsService');

  constructor(private readonly transactions: TransactionsRepository) {}

  async createWalletTransactionLog(
    user: UsersEntity,
    dto: WalletTransactionLogDto,
  ): Promise<Res> {
    const data = await this.transactions.createWalletTransactionLog(user, dto);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, data);
    this.logger.debug(
      `Transaction initiated for "id": "${
        user.id
      }", "name": "${await user.fullName()}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    return res;
  }

  async updateWalletTransactionLog(
    user: UsersEntity,
    id: number,
    status: TransactionStatus,
  ): Promise<Res> {
    const data = await this.transactions.updateWalletTransactionLog(id, status);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, data);
    this.logger.debug(
      `Transaction completed for "id": "${
        user.id
      }", "name": "${await user.fullName()}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    return res;
  }
}
