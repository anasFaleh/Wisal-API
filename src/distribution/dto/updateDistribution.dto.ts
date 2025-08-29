import { DistributionStatus } from '@prisma/client';
import { IsDate, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDistributionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsEnum(DistributionStatus)
  @IsOptional()
  status?: DistributionStatus

  @IsString()
  @IsOptional()
  description?: string

  @IsUUID()
  @IsOptional()
  couponTemplateId: string
}
