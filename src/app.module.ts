import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { HealthModule } from './modules/health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import * as ORMConfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ORMConfig),
    UsersModule,
    WalletsModule,
    HealthModule,
    TerminusModule,
    AuthModule,
    TransferModule,
    TransactionsModule,
  ],
})
export class AppModule {}
