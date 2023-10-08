import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { TransferDto } from './dto/transfer.dto';
import { UsersEntity } from 'src/entities/Users.entity';
import { Res } from 'src/models/Res.model';
import { NameEnquiryDto } from './dto/name-enquiry.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transfer')
@UseGuards(AuthGuard())
export class TransferController {
  private logger = new Logger('TransferController');
  constructor(private transferService: TransferService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  async transfer(
    @GetUser() user: UsersEntity,
    @Body() dto: TransferDto,
  ): Promise<Res> {
    return this.transferService.transfer(user, dto);
  }

  @Post('/name-enquiry')
  @UsePipes(ValidationPipe)
  async nameEnquiry(
    @GetUser() user: UsersEntity,
    @Body() dto: NameEnquiryDto,
  ): Promise<Res> {
    return this.transferService.nameEnquiry(user, dto);
  }
}
