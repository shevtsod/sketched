import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { WrapperType } from '../../../../utils/types';
import { AuthService } from '../../auth.service';
import { ExpressUser, JwtPayload } from '../../auth.type';
import { jwtFromRequest } from './jwt.util';

export const JWT_EXPIRES_IN = 15 * 60; // 15 minutes;

export const jwtSignOptions: JwtSignOptions = {
  expiresIn: JWT_EXPIRES_IN,
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    @Inject(forwardRef(() => AuthService))
    protected readonly authService: WrapperType<AuthService>,
  ) {
    // https://www.passportjs.org/packages/passport-jwt/
    super({
      jwtFromRequest: jwtFromRequest(),
      secretOrKey: Buffer.from(config.get<string>('SECRET')!),
    });
  }

  async validate(payload: JwtPayload): Promise<ExpressUser> {
    // if reach this code, JWT was already verified by Passport
    const user = await this.authService.validateJwt(payload);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
