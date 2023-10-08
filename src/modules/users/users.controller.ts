import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { UsersEntity } from 'src/entities/Users.entity';
import { Res } from 'src/models/Res.model';
import { CreatePinDto } from './dto/create-pin.dto';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private usersService: UsersService) {}

  @Get('/user')
  getUser(@GetUser() user: UsersEntity): Promise<Res> {
    return this.usersService.getUser(user);
  }

  @Post('/create-pin')
  @UsePipes(ValidationPipe)
  createPin(
    @GetUser() user: UsersEntity,
    @Body() dto: CreatePinDto,
  ): Promise<Res> {
    return this.usersService.createPin(user, dto);
  }
}
