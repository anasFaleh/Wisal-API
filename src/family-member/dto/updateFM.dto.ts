import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Gender, HealthStatus, Relation } from '../../common/enums';

export class UpdateFamilyMemberDto {
  @ApiPropertyOptional({
    description: 'Full name of the family member',
    example: 'Ahmed El-Faleh',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'National ID (must be exactly 9 digits)',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  @Length(9, 9)
  @Matches(/^\d+$/, { message: 'National ID must contain only digits' })
  nationalId?: string;

  @ApiPropertyOptional({
    description: 'Health status of the family member',
    enum: HealthStatus,
    example: HealthStatus.SPECIAL_NEEDS,
  })
  @IsOptional()
  @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;

  @ApiPropertyOptional({
    description: 'Relationship to the beneficiary',
    enum: Relation,
    example: Relation.SPOUSE,
  })
  @IsOptional()
  @IsEnum(Relation)
  relationship?: Relation;

  @ApiPropertyOptional({
    description: 'Date of birth of the family member',
    type: String,
    format: 'date-time',
    example: '2000-05-15T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'Gender of the family member',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
