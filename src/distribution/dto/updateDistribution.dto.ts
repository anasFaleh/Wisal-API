import { IsDate, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DistributionStatus } from '../../common/enums';

export class UpdateDistributionDto {
  @ApiPropertyOptional({
    example: 'VIP Distribution',
    description: 'Title of the distribution event'
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: '2025-09-10',
    description: 'Start date of the distribution',
    type: Date,
    format: 'date'
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2025-09-20',
    description: 'End date of the distribution',
    type: Date,
    format: 'date'
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    enum: DistributionStatus,
    example: DistributionStatus.COMPLETED,
    description: 'Status of the distribution'
  })
  @IsEnum(DistributionStatus)
  @IsOptional()
  status?: DistributionStatus;

  @ApiPropertyOptional({
    example: 'Food packs for Gaza families',
    description: 'Optional description'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'e3e9bd7c-6d87-4c2e-b82a-9dc82d09d25e',
    description: 'Coupon template ID'
  })
  @IsUUID()
  @IsOptional()
  couponTemplateId?: string;
}
