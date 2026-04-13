import { ThrottlerGuard, ThrottlerException, ThrottlerLimitDetail } from '@nestjs/throttler';
import { Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.user?.id || req.ip;
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const seconds = Math.ceil(throttlerLimitDetail.ttl / 1000);
    const timeMessage =
      seconds >= 60 ? `${Math.ceil(seconds / 60)} minute(s)` : `${seconds} second(s)`;

    throw new ThrottlerException(
      `Too many requests. Please try again in ${timeMessage}.`,
    );
  }
}
