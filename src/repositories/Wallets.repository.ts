import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsEntity } from 'src/entities/Wallets.entity';
import { UsersEntity } from 'src/entities/Users.entity';
import { DebitWalletDto } from 'src/modules/wallets/dto/debit-wallet.dto';
import { CreditWalletDto } from 'src/modules/wallets/dto/credit-wallet.dto';
import { NameEnquiryDto } from 'src/modules/transfer/dto/name-enquiry.dto';

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
      wallet.wallet_id = (
        Math.floor(Math.random() * 9000000000) + 1000000000
      ).toString();
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

  async debitWallet(dto: DebitWalletDto): Promise<WalletsEntity> {
    const { account_to_debit, amount } = dto;
    const wallet = await this.wallets.findOneBy({
      wallet_id: account_to_debit,
    });
    if (wallet) {
      if (wallet.balance < parseFloat(amount)) {
        throw new BadRequestException('Insuficient fund');
      }
      wallet.previous_balance = wallet.balance;
      wallet.balance = wallet.balance - parseFloat(amount);
      wallet.updated_at = new Date();
      await this.wallets.save(wallet);
      return wallet;
    } else {
      throw new NotFoundException('Account does not exist');
    }
  }

  async creditWallet(dto: CreditWalletDto): Promise<WalletsEntity> {
    const { account_to_credit, amount } = dto;
    const wallet = await this.wallets.findOneBy({
      wallet_id: account_to_credit,
    });
    if (wallet) {
      wallet.previous_balance = wallet.balance;
      wallet.balance =
        parseFloat(wallet.balance.toString()) + parseFloat(amount);
      wallet.updated_at = new Date();
      await this.wallets.save(wallet);
      return wallet;
    } else {
      throw new NotFoundException('Account does not exist');
    }
  }

  async nameEnquiry(dto: NameEnquiryDto): Promise<WalletsEntity> {
    const { account_no } = dto;
    const wallet = await this.wallets.findOneBy({
      wallet_id: account_no,
    });
    if (wallet) {
      return wallet;
    } else {
      throw new NotFoundException('Account does not exist');
    }
  }
}
