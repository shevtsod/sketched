import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

export interface JwtFromRequestOptions {
  cookie?: string;
}

/**
 * Extracts the JWT token from the given request
 *
 * @param opts configuration options
 * @returns token extracted from the request
 * @see {@link https://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request}
 */
export const jwtFromRequest =
  (opts: JwtFromRequestOptions = {}) =>
  (req: Request) => {
    // try to extract the JWT from the Authentication header as a Bearer token
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (bearerToken) return bearerToken;

    // try to extract the JWT from cookies
    const cookie = opts.cookie ?? 'access_token';
    const cookieToken = req.cookies[cookie] as string | undefined;
    if (cookieToken) return cookieToken;

    // no token
    return null;
  };
