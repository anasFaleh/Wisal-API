// deliver-coupon.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliverCouponDto {
  @ApiProperty({
    description: 'كود القسيمة لتسليمها',
    example: 'FO-R1-ABC123DEF'
  })
  @IsString()
  @IsNotEmpty()
  couponCode: string;

  @ApiProperty({
    description: 'معرف الموظف الذي قام بالتسليم',
    example: 'employee-id-123',
    required: false
  })
  @IsOptional()
  @IsString()
  deliveredBy?: string;
}