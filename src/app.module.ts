import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10
    }]),
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard
    }
  ],
  controllers: [AppController],
})
export class AppModule {}
