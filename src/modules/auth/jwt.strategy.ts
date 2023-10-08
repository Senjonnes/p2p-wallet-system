import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersEntity } from 'src/entities/Users.entity';
import { JwtPayload } from './jwt-payload-interface';
import { configService } from '../../config/typeorm.config';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly user: Repository<UsersEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getValue('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UsersEntity> {
    const { email } = payload;
    const user = await this.user.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    return user;
  }
}
