import { Injectable, Logger } from '@nestjs/common';
import { RES } from 'src/constants/responses';
import { UsersEntity } from 'src/entities/Users.entity';
import { Res } from 'src/models/Res.model';
import { UsersRepository } from 'src/repositories/Users.repository';
import { CreatePinDto } from './dto/create-pin.dto';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(private readonly users: UsersRepository) {}

  async getUser(user: UsersEntity): Promise<Res> {
    this.logger.debug(
      `User details fetched successfully "id": "${
        user.id
      }", "name": "${await user.fullName()}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    const res = await this.setUserData(user);
    return res;
  }

  async createPin(user: UsersEntity, dto: CreatePinDto): Promise<Res> {
    await this.users.createPin(user, dto);
    const res: Res = RES('PIN_CREATED_SUCCESSFULLY', 'SUCCESS', true);
    this.logger.debug(
      `Pin created successfully "id": "${
        user.id
      }", "name": "${await user.fullName()}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    return res;
  }

  private async setUserData(user: UsersEntity): Promise<Res> {
    const {
      id,
      created_at,
      updated_at,
      email,
      first_name,
      last_name,
      is_terms_condition_checked,
      dob,
      phone_number,
      address,
      last_login_timestamp,
      last_password_change,
      last_failed_login,
      failed_login_attempts,
      is_verified,
      is_active,
      locked_out,
    } = user;

    const res: Res = RES('SUCCESS', 'SUCCESS', true, {
      id,
      created_at,
      updated_at,
      email,
      first_name,
      last_name,
      is_terms_condition_checked,
      dob,
      phone_number,
      address,
      last_login_timestamp,
      last_password_change,
      last_failed_login,
      failed_login_attempts,
      is_verified,
      is_active,
      locked_out,
    });
    return res;
  }
}
