import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { EmployeeRole, EmployeeStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'محمد أحمد', description: 'الاسم الكامل للموظف' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'm.ahmed@example.com', description: 'البريد الإلكتروني' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'كلمة المرور' })
  @IsString()
  @IsNotEmpty()
  password: string;


  @ApiProperty({ 
    enum: EmployeeStatus, 
    example: EmployeeStatus.ACTIVE, 
    description: 'حالة الموظف',
    required: false 
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiProperty({ 
    example: 'institution-id-123', 
    description: 'معرف المؤسسة' 
  })
  @IsString()
  @IsNotEmpty()
  institutionId: string;
}