import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsEntity } from 'src/entities/Wallets.entity';
import { WalletsRepository } from 'src/repositories/Wallets.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletsEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository],
})
export class WalletsModule {}
