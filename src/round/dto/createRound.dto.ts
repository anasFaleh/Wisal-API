import { IsInt, IsDateString, IsOptional, IsNotEmpty, Min, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRoundDto {
  @ApiProperty({ example: 1, description: 'Round number' })
  @IsInt()
  @Min(1, { message: 'Round number must be at least 1' })
  @IsNotEmpty()
  roundNumber: number;

  @ApiProperty({ example: 100, description: 'Number of coupons in the round' })
  @IsInt()
  @Min(1, { message: 'Coupon count must be at least 1' })
  @IsNotEmpty()
  couponCount: number;

  @ApiProperty({ example: '2024-04-30T23:59:59Z', description: 'End date of the round' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: '2024-03-01T00:00:00Z', description: 'Start date of the round', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;
}
