import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { createSecretKey } from 'crypto';
import { AccountsModule } from '../../resources/accounts/accounts.module';
import { SessionsModule } from '../../resources/sessions/sessions.module';
import { UsersModule } from '../../resources/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { LocalStrategy } from './strategies/local/local.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt/refresh-jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    // https://github.com/nestjs/jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: createSecretKey(Buffer.from(config.get<string>('SECRET')!)),
      }),
    }),
    AccountsModule,
    SessionsModule,
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
