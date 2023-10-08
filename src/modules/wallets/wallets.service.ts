import { Injectable, Logger } from '@nestjs/common';
import { RES } from 'src/constants/responses';
import { UsersEntity } from 'src/entities/Users.entity';
import { Res } from 'src/models/Res.model';
import { WalletsRepository } from 'src/repositories/Wallets.repository';

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
    const notification = await this.wallets.getWallet(user);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, notification);
    this.logger.debug(`Wallet retrieved for "id": "${user.id}"`);
    return res;
  }

  async updateWallet(user: UsersEntity): Promise<Res> {
    const notification = await this.wallets.getWallet(user);
    const res: Res = RES('SUCCESS', 'SUCCESS', true, notification);
    this.logger.debug(`Wallet retrieved for "id": "${user.id}"`);
    return res;
  }
}
