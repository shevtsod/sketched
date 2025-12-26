import {
  Body,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Ip,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AccessToken, ExpressUser } from './auth.type';
import { RegisterInput } from './dto/register.input';
import { JWT_EXPIRES_IN } from './strategies/jwt/jwt.strategy';
import { LocalGuard } from './strategies/local/local.guard';
import { Public } from './strategies/public/public.decorator';
import { RefreshJwtGuard } from './strategies/refresh-jwt/refresh-jwt.guard';
import {
  REFRESH_JWT_EXPIRES_IN,
  refreshJwtFromRequest,
} from './strategies/refresh-jwt/refresh-jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Public()
  @Post('guest')
  async guest() {
    // TODO: Implement
    throw new InternalServerErrorException('Not Implemented');
  }

  @Public() // bypass JwtGuard
  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const token = await this.authService.login(req.user as ExpressUser, {
      ipAddress,
      userAgent,
    });

    this.setCookies(res, token);
    return token;
  }

  @Public() // bypass JwtGuard
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const token = await this.authService.refresh(
      req.user as ExpressUser,
      refreshJwtFromRequest(req)!,
      { ipAddress, userAgent },
    );

    if (!token) throw new UnauthorizedException();

    this.setCookies(res, token);
    return token;
  }

  @Get('userInfo')
  userInfo(@Req() req: Request) {
    return this.authService.userInfo(req.user as ExpressUser);
  }

  private setCookies(res: Response, token: AccessToken) {
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: `/${this.config.get<string>('BASE_PATH')}`,
      maxAge: JWT_EXPIRES_IN * 1000,
    });

    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: `/${this.config.get<string>('BASE_PATH')}`,
      maxAge: REFRESH_JWT_EXPIRES_IN * 1000,
    });
  }
}
