import {
  Injectable,
  Inject,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of, from, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

/**
 * Per-route TTL table.  First matching pattern wins.
 * 0 = skip caching entirely (real-time routes).
 */
const ROUTE_TTLS: [RegExp, number][] = [
  [/^\/message-deliveries/, 0],              // real-time delivery status – never cache
  [/^\/rounds\/[^/]+\/allocations/, 30_000], // 30 s  – live allocation/delivery data
  [/^\/messages/, 60_000],                   // 1 min
  [/^\/rounds/, 60_000],                     // 1 min
  [/^\/beneficiaries/, 120_000],             // 2 min
  [/^\/employees/, 120_000],                 // 2 min
  [/^\/family-members/, 120_000],            // 2 min
  [/^\/coupons/, 300_000],                   // 5 min
  [/^\/distributions/, 300_000],             // 5 min
  [/^\/institutions/, 300_000],              // 5 min
  [/^\/posts/, 600_000],                     // 10 min – posts change rarely
];

/**
 * Version keys must outlive the longest cached payload so they are never
 * evicted before the data they version.
 */
const VERSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RedisCacheInterceptor.name);
  private readonly defaultTtlMs: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.defaultTtlMs = this.configService.get<number>('REDIS_TTL', 300) * 1000;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.method !== 'GET') {
      return this.handleMutation(request, next);
    }

    const ttl = this.getTtlForRoute(request.path as string);
    if (ttl === 0) {
      return next.handle();
    }

    return from(this.buildCacheKey(request)).pipe(
      switchMap((key) =>
        from(this.cacheManager.get(key)).pipe(
          switchMap((cached) => {
            if (cached !== undefined && cached !== null) {
              this.logger.debug(`Cache hit: ${request.method} ${request.url}`);
              return of(cached);
            }

            return next.handle().pipe(
              tap({
                next: async (response) => {
                  try {
                    await this.cacheManager.set(key, response, ttl);
                  } catch (err) {
                    this.logger.error('Failed to set cache entry', err);
                  }
                },
              }),
            );
          }),
        ),
      ),
    );
  }

  // ─── Mutations ────────────────────────────────────────────────────────────

  private handleMutation(request: any, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: async () => {
          try {
            await this.bumpScopesForMutation(request);
          } catch (err) {
            this.logger.error('Failed to bump cache version', err);
          }
        },
      }),
    );
  }

  /**
   * Bumps every scope that could hold stale data after this mutation.
   *
   * 1. The actor's own scope (institution or beneficiary).
   * 2. If the URL targets a specific beneficiary (/beneficiaries/:uuid/…),
   *    also bump that beneficiary's personal scope — an employee mutating a
   *    beneficiary record must invalidate both the institution-wide list view
   *    AND the beneficiary's own cached responses.
   */
  private async bumpScopesForMutation(request: any): Promise<void> {
    const scopes = new Set<string>();
    scopes.add(this.getScopeId(request));

    const targetedBeneficiaryId = this.extractBeneficiaryIdFromPath(
      request.path as string,
    );
    if (targetedBeneficiaryId) {
      scopes.add(targetedBeneficiaryId);
    }

    await Promise.all([...scopes].map((s) => this.bumpVersion(s)));
  }

  private async bumpVersion(scopeId: string): Promise<void> {
    const versionKey = `version:${scopeId}`;
    const current =
      (await this.cacheManager.get<number>(versionKey)) ?? 0;
    await this.cacheManager.set(versionKey, current + 1, VERSION_TTL_MS);
    this.logger.debug(
      `Cache version bumped for scope "${scopeId}": ${current} → ${current + 1}`,
    );
  }

  // ─── Key building ─────────────────────────────────────────────────────────

  /**
   * Cache key: `cache:{scopeId}:v{version}:{normalizedPath}`
   *
   * Version-based invalidation avoids SCAN/DEL entirely.  Bumping the scope
   * version makes all existing keys for that scope unreachable; they expire
   * naturally via their data TTL.
   */
  private async buildCacheKey(request: any): Promise<string> {
    const scopeId = this.getScopeId(request);
    const version = await this.getScopeVersion(scopeId);
    const normalizedPath = this.normalizePath(request);
    return `cache:${scopeId}:v${version}:${normalizedPath}`;
  }

  private async getScopeVersion(scopeId: string): Promise<number> {
    return (
      (await this.cacheManager.get<number>(`version:${scopeId}`)) ?? 0
    );
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Scope assignment:
   * - Institution employees → `{institutionId}`
   *   All employees of the same institution share a cache partition; the role
   *   guard already ensures each employee only reaches endpoints they can
   *   access, so sharing the partition is safe.
   * - Beneficiaries (no institutionId in JWT) → `{userId}`
   *   Personal data must be isolated per user.
   * - Unauthenticated → `anonymous`
   */
  private getScopeId(request: any): string {
    const user = request.user;
    if (!user) return 'anonymous';
    return user.institutionId ?? user.id;
  }

  /**
   * Normalizes the request URL into a stable cache-key segment:
   * - Separates path from query string
   * - Re-serializes query params with sorted keys, dropping blank values
   *
   * This ensures ?page=1&limit=10 and ?limit=10&page=1 produce the same key.
   */
  private normalizePath(request: any): string {
    const [pathname] = (request.url as string).split('?');
    const params = request.query as Record<string, unknown>;

    if (!params || Object.keys(params).length === 0) {
      return pathname;
    }

    const sortedQuery = Object.keys(params)
      .sort()
      .filter(
        (k) =>
          params[k] !== undefined && params[k] !== null && params[k] !== '',
      )
      .map((k) => `${k}=${encodeURIComponent(String(params[k]))}`)
      .join('&');

    return sortedQuery ? `${pathname}?${sortedQuery}` : pathname;
  }

  private getTtlForRoute(path: string): number {
    for (const [pattern, ttl] of ROUTE_TTLS) {
      if (pattern.test(path)) return ttl;
    }
    return this.defaultTtlMs;
  }

  /**
   * Extracts a beneficiary UUID from paths like:
   *   /beneficiaries/550e8400-e29b-41d4-a716-446655440000
   *   /beneficiaries/550e8400-e29b-41d4-a716-446655440000/family-members
   */
  private extractBeneficiaryIdFromPath(path: string): string | null {
    const match = path.match(
      /^\/beneficiaries\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
    );
    return match?.[1] ?? null;
  }
}
