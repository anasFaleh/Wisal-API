import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { HealthStatus, Relation } from '@prisma/client';

export class CreateFamilyMemberDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @Length(9, 9)
  @Matches(/^\d+$/, { message: 'National ID must contain only digits' })
  nationalId: string;

  @IsEnum(HealthStatus)
  @IsNotEmpty()
  healthStatus: HealthStatus;

  @IsEnum(Relation)
  @IsNotEmpty()
  relationship: Relation;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date
}
