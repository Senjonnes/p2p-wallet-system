import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/config/typeorm.config';
import { UsersRepository } from 'src/repositories/Users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { UsersEntity } from 'src/entities/Users.entity';
import { WalletsService } from '../wallets/wallets.service';
import { WalletsRepository } from 'src/repositories/Wallets.repository';
import { WalletsEntity } from 'src/entities/Wallets.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: configService.getValue('JWT_SECRET'),
      signOptions: {
        expiresIn: parseInt(configService.getValue('JWT_VALIDITY')),
      },
    }),
    TypeOrmModule.forFeature([UsersEntity, WalletsEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    JwtStrategy,
    WalletsService,
    WalletsRepository,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
