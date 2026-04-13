import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CouponType } from '../../common/enums';

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
