import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { EmployeeRole, EmployeeStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from './createEmployee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiProperty({ example: 'أحمد محمد (محدث)', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ enum: EmployeeStatus, example: EmployeeStatus.INACTIVE, required: false })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

}