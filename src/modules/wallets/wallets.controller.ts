import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersEntity } from 'src/entities/Users.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Res } from 'src/models/Res.model';

@Controller('wallets')
@UseGuards(AuthGuard())
export class WalletsController {
  private logger = new Logger('WalletsController');
  constructor(private walletService: WalletsService) {}

  @Get('/wallet')
  async getWallet(@GetUser() user: UsersEntity): Promise<Res> {
    this.logger.log(
      `Get wallet for "id": "${user.id}", Filter: WalletsController Controller`,
    );
    return this.walletService.getWallet(user);
  }
}
