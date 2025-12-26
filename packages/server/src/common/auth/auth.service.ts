import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../../resources/accounts/accounts.service';
import { Provider } from '../../resources/accounts/entities/provider.enum';
import { Session } from '../../resources/sessions/entities/session.entity';
import { SessionsService } from '../../resources/sessions/sessions.service';
import { User } from '../../resources/users/entities/user.entity';
import { UsersService } from '../../resources/users/users.service';
import { verify } from '../crypto/argon2/argon2.util';
import { AccessToken, ExpressUser, JwtPayload } from './auth.type';
import { RegisterInput } from './dto/register.input';
import { JWT_EXPIRES_IN, jwtSignOptions } from './strategies/jwt/jwt.strategy';
import {
  REFRESH_JWT_EXPIRES_IN,
  refreshJwtSignOptions,
} from './strategies/refresh-jwt/refresh-jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates the given local account credentials and returns the matching
   * User record or null if no match
   *
   * @param username unique username
   * @param password plaintext password
   * @returns User if validated, null otherwise
   */
  async validateLocal(
    username: string,
    password: string,
  ): Promise<ExpressUser | null> {
    const user = await this.usersService.findUnique({ where: { username } });
    if (!user) return null;

    const account = await this.accountsService.findOne({
      where: { userId: user.id, providerId: 'local' },
    });

    if (!account?.password || !(await verify(account.password, password))) {
      return null;
    }

    return this.getExpressUser(user);
  }

  /**
   * Validates the given login JWT and returns the matching Express user
   *
   * NOTE: does NOT verify the JWT and assumes it was already verified.
   *
   * @param payload login JWT payload
   * @returns matching ExpressUser or null
   */
  async validateJwt(payload: JwtPayload): Promise<ExpressUser | null> {
    return this.getExpressUser(payload);
  }

  /**
   * Validates the given refresh JWT and returns the matching Express user
   *
   * NOTE: does NOT verify the JWT and assumes it was already verified.
   *
   * @param refreshJwt refresh JWT
   * @returns matching ExpressUser or null
   */
  async validateRefreshJwt(refreshJwt: string): Promise<ExpressUser | null> {
    const session = await this.findSession(refreshJwt);
    if (!session) return null;

    const user = await this.usersService.findUnique({
      where: { id: session.userId },
    });
    if (!user) return null;

    return this.getExpressUser(user);
  }

  /**
   * Registers a new User with the given inputs
   *
   * NOTE: the given inputs are assumed to have already been validated
   *
   * @param input registration inputs
   * @return new User record
   */
  async register(input: RegisterInput): Promise<User> {
    const { password, ...createUserInput } = input;

    // Create a User with the given inputs
    const user = (await this.usersService.create({ data: createUserInput }))[0];
    // Create a local account with the given password
    await this.accountsService.create({
      data: {
        userId: user.id,
        providerId: Provider.Local,
        accountId: `${user.id}`,
        password,
      },
    });

    return user;
  }

  /**
   * Logs in and signs an authentication token for a User
   *
   * @param expressUser Express user
   * @param opts optional parameters
   * @returns authentication token
   */
  async login(
    expressUser: ExpressUser,
    opts: {
      ipAddress?: string;
      userAgent?: string;
    } = {},
  ): Promise<AccessToken> {
    const { ipAddress, userAgent } = opts;

    const accessToken = await this.signAccessToken(expressUser);

    // Persist the refresh token in a session
    if (accessToken.refresh_token) {
      await this.sessionsService.create({
        data: {
          userId: expressUser.id,
          token: accessToken.refresh_token,
          expiresAt: new Date(Date.now() + REFRESH_JWT_EXPIRES_IN * 1000),
          ipAddress,
          userAgent,
        },
      });
    }

    return accessToken;
  }

  /**
   * Logs in using a refresh token and signs a new authentication token for a user
   *
   * @param expressUser Express user
   * @param refreshToken refresh token
   * @param opts optional parameters
   * @returns authentication token
   */
  async refresh(
    expressUser: ExpressUser,
    refreshToken: string,
    opts: {
      ipAddress?: string;
      userAgent?: string;
    } = {},
  ): Promise<AccessToken | null> {
    const { ipAddress, userAgent } = opts;

    // Find an existing session
    const session = await this.findSession(refreshToken);
    if (!session) return null;

    const accessToken = await this.signAccessToken(expressUser);

    // Persist the refresh token in a session
    if (accessToken.refresh_token) {
      await this.sessionsService.update({
        where: { id: session.id },
        data: {
          userId: expressUser.id,
          token: accessToken.refresh_token,
          expiresAt: new Date(Date.now() + REFRESH_JWT_EXPIRES_IN * 1000),
          ipAddress,
          userAgent,
        },
      });
    }

    return accessToken;
  }

  /**
   * Retrieves and returns the User record for the given Express user
   *
   * @param expressUser Express User
   * @returns User record
   */
  async userInfo(expressUser: ExpressUser) {
    return this.findUser(expressUser);
  }

  /**
   * Signs a login JWT with the given payload
   *
   * @param payload JWT payload to use
   * @returns login JWT token
   */
  private signLoginJwt(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, jwtSignOptions);
  }

  /**
   * Signs a refresh JWT with the given payload
   *
   * @param payload JWT payload to use
   * @returns refresh JWT token
   */
  private signRefreshJwt(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, refreshJwtSignOptions);
  }

  /**
   * Sign an authentication token w/ an access token and a refresh token
   * for the given Express user
   *
   * @param expressUser Express user to sign a token for
   * @returns authentication token
   */
  private async signAccessToken(
    expressUser: ExpressUser,
  ): Promise<AccessToken> {
    return {
      access_token: await this.signLoginJwt(expressUser),
      refresh_token: await this.signRefreshJwt(expressUser),
      token_type: 'Bearer',
      expires_in: JWT_EXPIRES_IN,
    };
  }

  /**
   * Converts the given User or JWT payload to an Express user
   *
   * @param user User record or JWT payload
   * @returns Express user
   */
  private getExpressUser(user: User | JwtPayload): ExpressUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  /**
   * Finds the matching User record for an Express user
   *
   * @param expressUser Express user
   * @returns User record or null
   */
  private findUser(expressUser: ExpressUser): Promise<User | null> {
    return this.usersService.findUnique({ where: { id: expressUser.id } });
  }

  /**
   * Retrieves the Session record for a JWT token
   *
   * @param token JWT token
   * @returns Session record or null
   */
  private async findSession(token: string): Promise<Session | null> {
    // decode JWT token to extract user ID
    const payload = this.jwtService.decode(token) as JwtPayload;
    // find all sessions for this user ID
    const sessions = await this.sessionsService.findMany({
      where: { userId: payload.id },
    });

    let res: Session | null = null;

    for (const session of sessions) {
      // delete expired session
      if (session.expiresAt < new Date()) {
        this.sessionsService.delete({ where: session });
      } else if (await verify(session.token, token)) {
        // found matching session for token
        res = session;
      }
    }

    return res;
  }
}
