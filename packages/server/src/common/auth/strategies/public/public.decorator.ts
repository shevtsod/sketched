import { SetMetadata } from '@nestjs/common';

//
//
//
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator that marks a route as public and bypasses the default global
 * authentication mechanism.
 *
 * @see {@link https://docs.nestjs.com/recipes/passport#enable-authentication-globally}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
