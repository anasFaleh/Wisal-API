import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmployeeStatus } from '../../common/enums';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'Mohamed Ahmed',
    description: 'Full name of the employee',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'm.ahmed@example.com',
    description: 'Valid email address of the employee',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the employee',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: EmployeeStatus,
    example: EmployeeStatus.ACTIVE,
    description: 'Employment status (ACTIVE / INACTIVE )',
    required: false,
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiProperty({
    example: 'bd4bc80f-af1b-4e1e-a028-535c1f3f32a8',
    description: 'ID (UUID) of the institution the employee belongs to',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  institutionId: string;
}
