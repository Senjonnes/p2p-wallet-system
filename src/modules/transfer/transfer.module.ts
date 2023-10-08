import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsEntity } from 'src/entities/Transactions.entity';
import { WalletsEntity } from 'src/entities/Wallets.entity';
import { UsersEntity } from 'src/entities/Users.entity';
import { UsersService } from '../users/users.service';
import { UsersRepository } from 'src/repositories/Users.repository';
import { WalletsService } from '../wallets/wallets.service';
import { WalletsRepository } from 'src/repositories/Wallets.repository';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsRepository } from 'src/repositories/Transactions.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UsersEntity, WalletsEntity, TransactionsEntity]),
  ],
  controllers: [TransferController],
  providers: [
    TransferService,
    UsersService,
    UsersRepository,
    WalletsService,
    WalletsRepository,
    TransactionsService,
    TransactionsRepository,
  ],
})
export class TransferModule {}
