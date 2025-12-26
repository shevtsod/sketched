import { faker } from '@faker-js/faker';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { jwtFromRequest, JwtFromRequestOptions } from './jwt.util';

describe('jwt.util', () => {
  it('gets JWT from request from bearer token', () => {
    const token = faker.string.alphanumeric({ length: 10 });
    const req = {} as Request;
    const mockFromAuthHeaderAsBearerToken = vi.fn(() => token);
    vi.spyOn(ExtractJwt, 'fromAuthHeaderAsBearerToken').mockReturnValue(
      mockFromAuthHeaderAsBearerToken,
    );
    const testJwtFromRequest = jwtFromRequest();
    const res = testJwtFromRequest(req);
    expect(mockFromAuthHeaderAsBearerToken).toHaveBeenCalledWith(req);
    expect(res).toBe(token);
  });

  it('gets JWT from request from bearer cookie', () => {
    const token = faker.string.alphanumeric({ length: 10 });
    const req = {
      cookies: {
        access_token: token,
      } as Record<string, any>,
    } as Request;
    const mockFromAuthHeaderAsBearerToken = vi.fn(() => null);
    vi.spyOn(ExtractJwt, 'fromAuthHeaderAsBearerToken').mockReturnValue(
      mockFromAuthHeaderAsBearerToken,
    );
    const testJwtFromRequest = jwtFromRequest();
    const res = testJwtFromRequest(req);
    expect(mockFromAuthHeaderAsBearerToken).toHaveBeenCalledWith(req);
    expect(mockFromAuthHeaderAsBearerToken).toHaveReturnedWith(null);
    expect(res).toBe(token);
  });

  it('gets JWT from request with options', () => {
    const options: JwtFromRequestOptions = {
      cookie: 'test_token',
    };
    const token = faker.string.alphanumeric({ length: 10 });
    const req = {
      cookies: {
        test_token: token,
      } as Record<string, any>,
    } as Request;
    const mockFromAuthHeaderAsBearerToken = vi.fn(() => null);
    vi.spyOn(ExtractJwt, 'fromAuthHeaderAsBearerToken').mockReturnValue(
      mockFromAuthHeaderAsBearerToken,
    );
    const testJwtFromRequest = jwtFromRequest(options);
    const res = testJwtFromRequest(req);
    expect(mockFromAuthHeaderAsBearerToken).toHaveBeenCalledWith(req);
    expect(mockFromAuthHeaderAsBearerToken).toHaveReturnedWith(null);
    expect(res).toBe(token);
  });

  it('returns null when unable to get JWT from request', () => {
    const req = {
      cookies: {},
    } as Request;
    const mockFromAuthHeaderAsBearerToken = vi.fn(() => null);
    vi.spyOn(ExtractJwt, 'fromAuthHeaderAsBearerToken').mockReturnValue(
      mockFromAuthHeaderAsBearerToken,
    );
    const testJwtFromRequest = jwtFromRequest();
    const res = testJwtFromRequest(req);
    expect(mockFromAuthHeaderAsBearerToken).toHaveBeenCalledWith(req);
    expect(mockFromAuthHeaderAsBearerToken).toHaveReturnedWith(null);
    expect(res).toBe(null);
  });
});
