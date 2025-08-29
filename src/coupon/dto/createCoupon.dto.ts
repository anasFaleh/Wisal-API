import { IsString, IsEnum, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { CouponType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  
  @IsEnum(CouponType)
  @IsNotEmpty()
  type: CouponType;


  @IsOptional()
  @IsString()
  description?: string;

  
  @IsUUID()
  @IsNotEmpty()
  institutionId: string;
}