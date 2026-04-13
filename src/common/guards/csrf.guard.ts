import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Double-Submit Cookie CSRF guard.
 *
 * On login/signup the server sets a random `csrf_token` cookie (non-httpOnly)
 * so the client can read it.  On every token-refresh request the client must
 * echo that value back in the `X-CSRF-Token` header.  A cross-site attacker
 * can forge the cookie send but cannot read the cookie value, so they cannot
 * set the matching header.
 *
 * Apply only to endpoints that authenticate via cookie (i.e. the /refresh
 * endpoints).  Bearer-token endpoints are not CSRF-vulnerable.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const fromHeader = req.headers['x-csrf-token'];
    const fromCookie = req.cookies?.csrf_token;

    if (
      !fromHeader ||
      !fromCookie ||
      typeof fromHeader !== 'string' ||
      fromHeader !== fromCookie
    ) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
