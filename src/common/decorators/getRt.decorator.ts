import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

export const GetRefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies['refresh_token'];
  },
);
