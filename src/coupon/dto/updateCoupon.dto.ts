import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CouponType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCouponDto {
  @ApiPropertyOptional({
    example: 'Updated Food Package',
    description: 'The updated name of the coupon',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    enum: CouponType,
    example: CouponType.CASH,
    description: 'The updated type of the coupon',
  })
  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType;

  @ApiPropertyOptional({
    example: 'Updated description for the coupon',
    description: 'Optional updated description of the coupon',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
