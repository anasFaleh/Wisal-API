import { forwardRef, Module } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';
import { RtGuard } from './guards/rt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InstitutionAuthController } from './controllers/InstitutionAuth.controller';
import { InstitutionAuthService } from './Services/institutionAuth.service';
import { BeneficiaryAuthController } from './controllers/beneficirayAuth.controller';
import { BeneficiaryAuthService } from './Services/beneficiaryAuth.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [
    InstitutionAuthController,
    BeneficiaryAuthController
  ],

  providers: [
    BeneficiaryAuthService,
    InstitutionAuthService,
    JwtGuard,
    RtGuard,
    JwtStrategy,
    RtStrategy,
  ],
  exports: []
})
export class AuthModule { }
