import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { HealthStatus, HousingStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterBeneficiariesDto {
  @ApiPropertyOptional({
    description: 'Filter by health status',
    enum: HealthStatus,
    example: HealthStatus.NORMAL,
  })
  @IsOptional()
  @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;

  @ApiPropertyOptional({
    description: 'Filter by housing status',
    enum: HousingStatus,
    example: HousingStatus.OWNED,
  })
  @IsOptional()
  @IsEnum(HousingStatus)
  housingStatus?: HousingStatus;

  @ApiPropertyOptional({
    description: 'Minimum income filter (USD)',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minIncome?: number;

  @ApiPropertyOptional({
    description: 'Maximum income filter (USD)',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxIncome?: number;

  @ApiPropertyOptional({
    description: 'Minimum family size filter',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  minFamilySize?: number;

  @ApiPropertyOptional({
    description: 'Maximum family size filter',
    example: 8,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  maxFamilySize?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination (default: 1)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination (default: 10)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
