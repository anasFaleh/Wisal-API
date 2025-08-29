import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CouponType } from '@prisma/client';

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType;

  @IsOptional()
  @IsString()
  description?: string;
}
