import { Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsEntity } from 'src/entities/Wallets.entity';
import { UsersEntity } from 'src/entities/Users.entity';

@Injectable()
export class WalletsRepository {
  private logger = new Logger('WalletsRepository');
  constructor(
    @InjectRepository(WalletsEntity)
    private readonly wallets: Repository<WalletsEntity>,
  ) {}

  async createWallet(user: UsersEntity): Promise<WalletsEntity> {
    let wallet = await this.getWallet(user);
    if (wallet) {
      return wallet;
    } else {
      wallet = new WalletsEntity();
      wallet.balance = 0;
      wallet.previous_balance = 0;
      wallet.reference = new Date(Date.now()).getTime().toString();
      wallet.user = user;
      try {
        await wallet.save();
        return wallet;
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async getWallet(user: UsersEntity): Promise<WalletsEntity> {
    const wallet = this.wallets.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (wallet) {
      return wallet;
    } else {
      throw new NotFoundException();
    }
  }
}
