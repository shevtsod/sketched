/** Data stored in req.user in Express */
export interface ExpressUser {
  id: number;
  username: string;
  email: string;
}

/** JWT payload properties */
export interface JwtPayload {
  [key: string]: any;
  iat?: number;
  exp?: number;
}

/** Authentication token contents */
export interface AuthToken {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  scope?: string;
  expires_in?: number;
}
