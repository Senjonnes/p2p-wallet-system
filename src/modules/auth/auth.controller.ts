import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { AuthRes } from 'src/models/AuthRes.model';
import { LoginDto } from './dto/login.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() dto: SignupDto): Promise<AuthRes> {
    return this.authService.signup(dto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() dto: LoginDto): Promise<AuthRes> {
    return this.authService.login(dto);
  }

  @Post('/verify-code')
  @UsePipes(ValidationPipe)
  verifyCode(@Body() dto: VerifyCodeDto): Promise<AuthRes> {
    return this.authService.verifyCode(dto);
  }

  @Post('/resend-code')
  @UsePipes(ValidationPipe)
  resendCode(@Body() dto: ResendCodeDto): Promise<AuthRes> {
    return this.authService.resendCode(dto);
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<AuthRes> {
    return this.authService.forgotPassword(dto);
  }

  @Post('/verify-otp')
  @UsePipes(ValidationPipe)
  verifyOtp(@Body() dto: ForgotPasswordDto): Promise<AuthRes> {
    return this.authService.verifyOtp(dto);
  }

  @Post('/reset-password')
  @UsePipes(ValidationPipe)
  changePassword(@Body() dto: ForgotPasswordDto): Promise<AuthRes> {
    return this.authService.changePassword(dto);
  }
}
