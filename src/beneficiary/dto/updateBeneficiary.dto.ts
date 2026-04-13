import {
  IsString,
  IsOptional,
  IsEnum,
  Length,
  Matches,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, HealthStatus, HousingStatus } from '../../common/enums';

export class UpdateBeneficiaryDto {
  @ApiPropertyOptional({
    description: 'Full name of the beneficiary',
    example: 'Ahmed Ali',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @Length(3, 100)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the beneficiary',
    example: '+970599123456',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9+\- ]*$/, {
    message: 'Phone must contain only digits, spaces, + or -',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Address of the beneficiary',
    example: 'Gaza City, Palestine',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Health status of the beneficiary',
    enum: HealthStatus,
    example: HealthStatus.CHRONIC_DISEASE,
  })
  @IsEnum(HealthStatus)
  @IsOptional()
  healthStatus?: HealthStatus;

  @ApiPropertyOptional({
    description: 'Date of birth of the beneficiary',
    type: String,
    format: 'date',
    example: '1990-05-15',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'Housing status of the beneficiary',
    enum: HousingStatus,
    example: HousingStatus.TENT,
  })
  @IsEnum(HousingStatus)
  @IsOptional()
  housingStatus?: HousingStatus;

  @ApiPropertyOptional({
    description: 'Gender of the beneficiary',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Monthly income of the beneficiary in USD',
    example: 300,
  })
  @IsNumber()
  @IsOptional()
  income?: number;
}
