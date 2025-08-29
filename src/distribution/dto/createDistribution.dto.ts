import { DistributionStatus } from '@prisma/client';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, isString, IsString, IsUUID } from 'class-validator';

export class CreateDistributionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsEnum(DistributionStatus)
  @IsNotEmpty()
  status: DistributionStatus

  @IsString()
  @IsOptional()
  description: string

  @IsUUID()
  @IsNotEmpty()
  couponTemplateId: string
}
