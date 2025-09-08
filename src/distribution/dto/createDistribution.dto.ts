import { DistributionStatus } from '@prisma/client';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDistributionDto {
  @ApiProperty({
    example: 'Ramadan Food Distribution',
    description: 'Title of the distribution event'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '2025-09-10',
    description: 'Start date of the distribution',
    type: String,
    format: 'date'
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    example: '2025-09-20',
    description: 'End date of the distribution',
    type: String,
    format: 'date'
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    enum: DistributionStatus,
    example: DistributionStatus.ACTIVE,
    description: 'Status of the distribution'
  })
  @IsEnum(DistributionStatus)
  @IsNotEmpty()
  status: DistributionStatus;

  @ApiPropertyOptional({
    example: 'Food packs for Gaza families',
    description: 'Optional description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'f185dff9-15c1-47eb-b3d6-8494f31138f9', description: 'Coupon template ID' })
  @IsUUID()
  @IsNotEmpty()
  couponTemplateId: string;
}
