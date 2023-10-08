import { Injectable, Logger } from '@nestjs/common';
import {
  AUTHRES,
  AUTHRESFAILED,
  FAILED,
  INVALID_PARAMETER,
} from 'src/constants/responses';
import { AuthRes } from 'src/models/AuthRes.model';
import { UsersRepository } from 'src/repositories/Users.repository';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload-interface';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/entities/Users.entity';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly users: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthRes> {
    const user = await this.users.signup(dto);
    const res: AuthRes = AUTHRES('ACCOUNT_CREATED_SUCCESSFULLY', 'SUCCESS');
    this.logger.debug(
      `Account Sucessfully created for "id": "${
        user.id
      }", "name": "${JSON.stringify(
        user.fullName(),
      )}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    return res;
  }

  async login(dto: LoginDto): Promise<AuthRes> {
    const user = await this.users.login(dto);
    if (!user.is_verified) {
      await this.users.checkAndUpdateVerificationCode(user);
      return FAILED('ACCOUNT_VERIFICATION_CODE_FAILED');
    } else {
      const payload: JwtPayload = { email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      this.logger.debug(
        `Generated JWT Token with payload ${JSON.stringify(payload)}`,
      );

      const res = await this.setUserData(user, accessToken);
      return res;
    }
  }

  async verifyCode(dto: VerifyCodeDto): Promise<AuthRes> {
    const user = await this.users.verifyCode(dto);
    if (!user) {
      const res = INVALID_PARAMETER('EXPIRED_INVALID_CODE');
      return res;
    } else {
      const payload: JwtPayload = { email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      this.logger.debug(
        `Generated JWT Token with payload ${JSON.stringify(payload)}`,
      );
      const res = await this.setUserData(user, accessToken);
      return res;
    }
  }

  async resendCode(dto: ResendCodeDto): Promise<AuthRes> {
    const user = await this.users.resendCode(dto);
    const res: AuthRes = AUTHRES('VERIFICATION_CODE_SENT', 'SUCCESS');
    this.logger.debug(
      `Verification code sent for "id": "${user.id}", "name": "${JSON.stringify(
        user.fullName(),
      )}", Filter: ${JSON.stringify({
        email: user.email,
      })}`,
    );
    return res;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<AuthRes> {
    await this.users.forgotPassword(dto);
    this.logger.debug(`Verification code sent for Email "${dto.email}"`);
    const res: AuthRes = AUTHRES('FORGOT_PASSWORD_EMAIL_SENT', 'SUCCESS');
    return res;
  }

  async verifyOtp(dto: ForgotPasswordDto): Promise<AuthRes> {
    const user = await this.users.verifyOtp(dto);
    if (!user) {
      const res = INVALID_PARAMETER('INVALID_OTP');
      return res;
    } else {
      this.logger.debug(
        `Forgot password code veriication successful "${{
          email: dto.email,
        }}" for User "${user.id}"`,
      );
      const res: AuthRes = AUTHRES('SUCCESS', 'SUCCESS');
      return res;
    }
  }

  async changePassword(dto: ForgotPasswordDto): Promise<AuthRes> {
    const user = await this.users.changePassword(dto);
    const isTokenValid = await this.verifyOtp(dto);
    if (isTokenValid.status && dto.new_password !== dto.confirm_password) {
      this.logger.debug(`Password does not match "${{ email: dto.email }}"`);
      const res: AuthRes = AUTHRESFAILED('PASSWORD_NOT_MATCHED', 'FAILED');
      return res;
    } else {
      const newUser = await this.users.changeUserPassword(dto, user);
      if (newUser) {
        this.logger.debug(
          `Password successfully changed "${{
            email: dto.email,
          }}"`,
        );
        const res: AuthRes = AUTHRES(
          'PASSWORD_CHANGED_SUCCESSFULLY',
          'SUCCESS',
        );
        return res;
      }
    }
  }

  private async setUserData(
    user: UsersEntity,
    accessToken: string,
  ): Promise<AuthRes> {
    const {
      id,
      email,
      first_name,
      last_name,
      phone_number,
      dob,
      address,
      is_verified,
      locked_out,
    } = user;

    const res: AuthRes = AUTHRES(
      'SUCCESS',
      'SUCCESS',
      {
        id,
        email,
        first_name,
        last_name,
        phone_number,
        dob,
        address,
        is_verified,
        locked_out,
      },
      accessToken,
    );
    return res;
  }
}
