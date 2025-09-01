import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsEnum, IsDate } from 'class-validator';
import { HealthStatus, Relation } from '@prisma/client';

export class CreateFamilyMemberDto {
  @ApiProperty({
    description: 'Full name of the family member',
    example: 'Anas El-Faleh',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'National ID (exactly 9 digits)',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  @Length(9, 9)
  @Matches(/^\d+$/, { message: 'National ID must contain only digits' })
  nationalId: string;

  @ApiProperty({
    description: 'Health status of the family member',
    enum: HealthStatus,
    example: HealthStatus.NORMAL,
  })
  @IsEnum(HealthStatus)
  @IsNotEmpty()
  healthStatus: HealthStatus;

  @ApiProperty({
    description: 'Relationship to the applicant',
    enum: Relation,
    example: Relation.PARENT,
  })
  @IsEnum(Relation)
  @IsNotEmpty()
  relationship: Relation;

  @ApiProperty({
    description: 'Date of birth',
    example: '2005-08-15',
    type: String,
    format: 'date',
  })
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;
}
