import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import type { WrapperType } from '../../../../utils/types';
import { AuthService } from '../../auth.service';
import { ExpressUser } from '../../auth.type';
import { jwtFromRequest } from '../jwt/jwt.util';

export const refreshJwtFromRequest = jwtFromRequest({
  cookie: 'refresh_token',
});

export const REFRESH_JWT_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days

export const refreshJwtSignOptions: JwtSignOptions = {
  expiresIn: REFRESH_JWT_EXPIRES_IN,
};

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly config: ConfigService,
    @Inject(forwardRef(() => AuthService))
    protected readonly authService: WrapperType<AuthService>,
  ) {
    // https://www.passportjs.org/packages/passport-jwt/
    super({
      jwtFromRequest: refreshJwtFromRequest,
      secretOrKey: Buffer.from(config.get<string>('SECRET')!),
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<ExpressUser> {
    // if reach this code, JWT was already verified by Passport
    const token = refreshJwtFromRequest(req);
    if (!token) throw new UnauthorizedException();
    const user = await this.authService.validateRefreshJwt(token);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
