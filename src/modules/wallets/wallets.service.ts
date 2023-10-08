import { Injectable, Logger } from '@nestjs/common';
import { RES } from 'src/constants/responses';
import { UsersEntity } from 'src/entities/Users.entity';
import { Res } from 'src/models/Res.model';
import { WalletsRepository } from 'src/repositories/Wallets.repository';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { DebitWalletDto } from './dto/debit-wallet.dto';
import { NameEnquiryDto } from '../transfer/dto/name-enquiry.dto';

@Injectable()
export class WalletsService {
  private logger = new Logger('WalletsService');

  constructor(private readonly wallets: WalletsRepository) {}

  async createWallet(user: UsersEntity): Promise<Res> {
    const wallet = await this.wallets.createWallet(user);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, wallet);
    this.logger.debug(`Wallet created for "id": "${user.id}"`);
    return res;
  }

  async getWallet(user: UsersEntity): Promise<Res> {
    const data = await this.wallets.getWallet(user);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, data);
    this.logger.debug(`Wallet retrieved for "id": "${user.id}"`);
    return res;
  }

  async debitWallet(dto: DebitWalletDto): Promise<Res> {
    const data = await this.wallets.debitWallet(dto);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, data);
    this.logger.debug(
      `Wallet debitted from "account": "${dto.account_to_debit}"`,
    );
    return res;
  }

  async creditWallet(dto: CreditWalletDto): Promise<Res> {
    const data = await this.wallets.creditWallet(dto);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, data);
    this.logger.debug(`Wallet credit to "account": "${dto.account_to_credit}"`);
    return res;
  }

  async nameEnquiry(dto: NameEnquiryDto): Promise<Res> {
    const data = await this.wallets.nameEnquiry(dto);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, data);
    this.logger.debug(
      `Wallet account fetched for "account": "${dto.account_no}"`,
    );
    return res;
  }
}
