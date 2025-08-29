import { IsDate, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { HealthStatus, Relation } from '@prisma/client';

export class UpdateFamilyMemberDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @Length(9, 9)
  @Matches(/^\d+$/, { message: 'National ID must contain only digits' })
  nationalId?: string;

  @IsOptional()
  @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;

  @IsEnum(Relation)
  @IsOptional()
  relationship: Relation;

  @IsDate()
  @IsOptional()
  dateOfBirth: Date
}
