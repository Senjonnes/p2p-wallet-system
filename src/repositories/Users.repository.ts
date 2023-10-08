import { UsersEntity } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from '../constants/encrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from 'src/modules/auth/dto/signup.dto';
import { timeNowMilliseconds, verificationCode } from 'src/constants/handlers';
import { InjectRepository } from '@nestjs/typeorm';
import { configService } from 'src/config/typeorm.config';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { AccessLogEntity } from 'src/entities/AccessLogs.entity';
import { MESSAGES } from 'src/constants/responses';
import { VerifyCodeDto } from 'src/modules/auth/dto/verify-code.dto';
import { ResendCodeDto } from 'src/modules/auth/dto/resend-code.dto';
import { ForgotPasswordDto } from 'src/modules/auth/dto/forgot-password.dto';
import { CreatePinDto } from 'src/modules/users/dto/create-pin.dto';

@Injectable()
export class UsersRepository {
  private logger = new Logger('UsersRepository');
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  async signup(dto: SignupDto): Promise<UsersEntity> {
    const {
      email,
      first_name,
      last_name,
      phone_number,
      dob,
      address,
      password,
      is_terms_condition_checked,
    } = dto;

    if (!is_terms_condition_checked) {
      throw new InternalServerErrorException('Terms and condition is required');
    }

    // New User
    const user = new UsersEntity();
    user.email = email;
    user.first_name = first_name;
    user.last_name = last_name;
    user.phone_number = phone_number;
    user.dob = dob;
    user.address = address;
    user.is_terms_condition_checked = is_terms_condition_checked;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.verification_code = verificationCode().toString();
    user.verification_time = timeNowMilliseconds();

    try {
      await this.users.save(user);
      this.logger.debug(
        `user created successfully, Filter: ${JSON.stringify({
          email: user.email,
        })}`,
      );
      return user;
    } catch (error) {
      if (error.code === '23505') {
        //duplicate email
        this.logger.error(
          `Email "${user.email}" already exists "${user.email}"`,
          error.stack,
        );
        throw new ConflictException('Email already exists');
      } else {
        this.logger.error(error, error.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  async login(dto: LoginDto): Promise<UsersEntity> {
    let user = await this.validateUserPassword(dto);
    const accessLog = new AccessLogEntity();
    accessLog.user = user;
    const { email } = dto;

    if (!user) {
      const login = {
        email,
      };
      this.logger.debug(`Invalid credential, Filter: ${JSON.stringify(login)}`);
      throw new UnauthorizedException('Invalid credentials');
    } else {
      user = await this.users.findOneBy({
        email: email.toLowerCase(),
      });

      if (!user.is_active) {
        throw new UnauthorizedException(MESSAGES.ACCOUNT_DISABLED);
      }

      if (!user.is_verified) {
        this.logger.debug(
          `User not verified, Filter: ${JSON.stringify({ email: user.email })}`,
        );
      } else {
        this.logger.debug(
          `Successful login, Filter: ${JSON.stringify({ email: user.email })}`,
        );
        accessLog.is_successful_login = true;
        user.last_login_timestamp = new Date();
        await user.save();
        await accessLog.save();
      }
      return user;
    }
  }

  async verifyCode(dto: VerifyCodeDto): Promise<UsersEntity> {
    const { email, code } = dto;
    const user = await this.users.findOneBy({ email: email });
    if (!user) {
      this.logger.debug(
        `Failed to verify user, Filter: ${JSON.stringify(dto)}`,
      );
      throw new UnauthorizedException('User does not exist');
    } else {
      const verification_code = user.verification_code;
      const timeNow = timeNowMilliseconds();
      const timeLeft = timeNow - user.verification_time;
      const code_validity = configService.getValue(
        'VERIFICATION_CODE_VALIDITY',
      );
      const is_code_valid = timeLeft < parseInt(code_validity);
      if ((is_code_valid && verification_code === code) || user.is_verified) {
        const accessLog = new AccessLogEntity();
        accessLog.user = user;
        this.logger.debug(
          `User verified, Filter: ${JSON.stringify({ email: user.email })}`,
        );
        accessLog.is_successful_login = true;
        user.verification_token = null;
        user.last_login_timestamp = new Date();
        user.is_verified = true;
        user.verification_code = null;
        user.verification_time = null;
        try {
          this.logger.debug(
            `User and access log updated, Filter: ${JSON.stringify({
              email: user.email,
            })}`,
          );
          await accessLog.save();
          await user.save();
        } catch (error) {
          this.logger.error(
            `Failed to save user, Filter: ${JSON.stringify({
              email: user.email,
            })}`,
            error.stack,
          );
          throw new InternalServerErrorException();
        }
        return user;
      } else if (!verification_code && !user.is_verified) {
        throw new UnauthorizedException(
          'User not verified. Please login to request for verification token.',
        );
      } else {
        this.logger.debug(
          `Invalid Verification Code or Verification Code has expired, Filter: ${JSON.stringify(
            {
              email: user.email,
            },
          )}`,
        );
        return null;
      }
    }
  }

  async resendCode(dto: ResendCodeDto): Promise<UsersEntity> {
    const { email } = dto;
    const user = await this.users.findOneBy({ email: email });
    if (!user) {
      this.logger.debug(
        `Failed to send verification code, Filter: ${JSON.stringify(dto)}`,
      );
      throw new UnauthorizedException('User does not exist');
    } else {
      const user_profile = await this.checkAndUpdateVerificationCode(user);
      return user_profile;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<UsersEntity> {
    const user = await this.users.findOneBy({
      email: dto.email.toLowerCase(),
    });
    if (!user) {
      this.logger.debug(`User with Email "${dto.email}" does not exit`);
      throw new NotFoundException(
        `User with Email "${dto.email}" does not exit`,
      );
    } else {
      const user_profile = await this.checkAndUpdateVerificationCode(user);
      return user_profile;
    }
  }

  async verifyOtp(dto: ForgotPasswordDto): Promise<UsersEntity> {
    const { email, code } = dto;
    const user = await this.users.findOneBy({ email: email });
    if (!user) {
      this.logger.debug(
        `Failed to verify user, Filter: ${JSON.stringify(dto)}`,
      );
      throw new UnauthorizedException('User does not exist');
    } else {
      const verification_code = user.verification_code;
      const timeNow = timeNowMilliseconds();
      const timeLeft = timeNow - user.verification_time;
      const code_validity = configService.getValue(
        'VERIFICATION_CODE_VALIDITY',
      );
      const is_code_valid = timeLeft < parseInt(code_validity);
      if (is_code_valid && verification_code === code) {
        return user;
      } else {
        this.logger.debug(
          `Invalid OTP or OTP has expired, Filter: ${JSON.stringify({
            email: user.email,
          })}`,
        );
        return null;
      }
    }
  }

  async changePassword(dto: ForgotPasswordDto): Promise<UsersEntity> {
    const user = await this.users.findOneBy({ email: dto.email });
    return user;
  }

  async validateUserPassword(dto: LoginDto): Promise<any> {
    const { email, password } = dto;
    const user = await this.users.findOneBy({ email: email.toLowerCase() });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      await this.loginFailed(dto, user);
      return null;
    }
  }

  async changeUserPassword(password: any, user: UsersEntity): Promise<boolean> {
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password.new_password, user.salt);
    user.verification_code = null;
    try {
      await user.save();
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException();
    }
    return true;
  }

  async checkAndUpdateVerificationCode(
    user: UsersEntity,
  ): Promise<UsersEntity> {
    if (!user.verification_code) {
      user.verification_code = verificationCode().toString();
      user.verification_time = timeNowMilliseconds();
      await user.save();
    } else {
      const timeNow = timeNowMilliseconds();
      const timeLeft = timeNow - user.verification_time;
      const code_validity = configService.getValue(
        'VERIFICATION_CODE_VALIDITY',
      );
      const is_code_valid = timeLeft < parseInt(code_validity);
      if (!is_code_valid) {
        user.verification_code = verificationCode().toString();
        user.verification_time = timeNowMilliseconds();
        await user.save();
      }
    }
    return user;
  }

  async createPin(user: UsersEntity, dto: CreatePinDto): Promise<UsersEntity> {
    const { pin, confirm_pin } = dto;

    if (user.has_pin) {
      throw new ConflictException('User already has PIN');
    }

    if (pin !== confirm_pin) {
      throw new BadRequestException('Pin does not match');
    }

    user.has_pin = true;
    user.pin = crypto.encrypt(pin);

    try {
      await this.users.save(user);
      this.logger.debug(
        `Pin created successfully, Filter: ${JSON.stringify({
          email: user.email,
        })}`,
      );
      return user;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async validatePin(user: UsersEntity, pin: string): Promise<boolean> {
    try {
      const decrypt = crypto.decrypt(user.pin);
      if (decrypt === pin) {
        return true;
      }
      throw new BadRequestException('Invalid PIN');
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException('Invalid PIN');
    }
  }

  private async loginFailed(dto: any, user: UsersEntity): Promise<any> {
    try {
      const accessLog = new AccessLogEntity();
      accessLog.user = user;
      accessLog.is_successful_login = false;
      user.failed_login_attempts = user.failed_login_attempts + 1;
      await user.save();
      return accessLog.save();
    } catch (error) {
      throw new InternalServerErrorException('Invalid credentials');
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
