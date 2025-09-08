import { IsString, IsEnum, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CouponType } from '../../common/enums';

export class CreateCouponDto {
  @ApiProperty({
    example: 'Food Package',
    description: 'The name of the coupon',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: CouponType,
    example: CouponType.FOOD,
    description: 'The type of the coupon',
  })
  @IsEnum(CouponType)
  @IsNotEmpty()
  type: CouponType;

  @ApiProperty({
    example: 'Coupon for monthly food distribution',
    description: 'Optional description of the coupon',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'The institution ID associated with this coupon',
  })
  @IsUUID()
  @IsNotEmpty()
  institutionId: string;
}
