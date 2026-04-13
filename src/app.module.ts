import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from './common/config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/logger/logger.interceptor';
import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from './common/logger/logger.config';
import { AuthModule } from './auth/auth.module';
import { FamilyMemberModule } from './family-member/family-member.module';
import { InstitutionModule } from './institution/institution.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { EmployeeModule } from './employee/employee.module';
import { DistributionModule } from './distribution/distribution.module';
import { RoundModule } from './round/round.module';
import { CouponModule } from './coupon/coupon.module';
import { RoundBeneficiaryModule } from './round-beneficiary/round-beneficiary.module';
import { PostModule } from './post/post.module';
import { MessageModule } from './message/message.module';
import { MessageDeliveryModule } from './message-delivery/message-delivery.module';
import { AppController } from './app.controller';
import { UploadsModule } from './uploads/uploads.module';
import { UserThrottlerGuard } from './common/guards';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisCacheInterceptor } from './common/interceptors/caching.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    WinstonModule.forRoot(WinstonConfig),
    PrismaModule,
    AuthModule,
    FamilyMemberModule,
    InstitutionModule,
    BeneficiaryModule,
    EmployeeModule,
    DistributionModule,
    RoundModule,
    CouponModule,
    RoundBeneficiaryModule,
    PostModule,
    MessageModule,
    MessageDeliveryModule,
    UploadsModule,
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000,  // 1 minute
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 900_000, // 15 minutes
        limit: 5,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get<number>('REDIS_TTL', 300) * 1000, // cache-manager v7 expects ms
      }),
    }),
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisCacheInterceptor
    }
  ],
  controllers: [AppController],
})
export class AppModule {}
