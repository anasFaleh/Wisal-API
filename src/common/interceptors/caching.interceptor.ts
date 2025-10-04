import { Injectable, Inject, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of, from, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    const request = context.switchToHttp().getRequest();
    console.log('Intercepting request:', request.method, request.url);


    const key = this.generateCacheKey(request);

    if (request.method === 'GET') {
      return from(this.cacheManager.get(key)).pipe(
        switchMap((cachedResponse) => {
          if (cachedResponse) {
            console.log(`💾 Cache hit for key: ${key}`);
            return of(cachedResponse);
          }

          return next.handle().pipe(
            tap({
              next: async (response) => {
                try {
                  await this.cacheManager.set(key, response, 300 * 1000 ); 
                } catch (error) {
                  console.error('Failed to set cache:', error);
                }
              },
            }),
          );
        }),
      );
    }

    return next.handle().pipe(
      tap({
        next: async () => {
          try {
            const pattern = `cache:${request.user?.id || 'anonymous'}:*`;
            await this.invalidateCacheByPattern(pattern);
          } catch (error) {
            console.error('Failed to invalidate cache:', error);
          }
        },
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const userId = request.user?.id || 'anonymous';
    return `cache:${userId}:${request.method}:${request.url}:${JSON.stringify(request.query)}`;
  }

 private async invalidateCacheByPattern(pattern: string) {
  try {
    const store: any = (this.cacheManager as any).store; 

    if (store && typeof store.keys === 'function') {
      const keys: string[] = await store.keys(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => store.del(key)));
      }
    } else {
      console.warn('Redis store not available, cannot invalidate cache.');
    }
  } catch (error) {
    console.error('Failed to invalidate cache:', error);
  }
}


}
