import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { HealthStatus, HousingStatus } from '@prisma/client';

export class FilterBeneficiariesDto {
  @IsOptional()
  @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;

  @IsOptional()
  @IsEnum(HousingStatus)
  housingStatus?: HousingStatus; 

  @IsOptional()
  @IsNumber()
  @Min(0)
  minIncome?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxIncome?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minFamilySize?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxFamilySize?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
