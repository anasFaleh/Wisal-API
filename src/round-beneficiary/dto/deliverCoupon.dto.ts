import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliverCouponDto {
  @ApiProperty({
    description: 'Coupon code to be delivered',
    example: 'FO-R1-ABC123DEF',
  })
  @IsString()
  @IsNotEmpty()
  couponCode: string;
}
