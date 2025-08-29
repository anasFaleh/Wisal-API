import { IsOptional, IsString, IsEnum, IsEmail } from 'class-validator';
import { InstitutionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInstitutionDto {
  
  @ApiProperty({
    description: 'اسم المؤسسة',
    example: 'جمعية الرحمة الخيرية (محدث)',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'البريد الإلكتروني للمؤسسة',
    example: 'info@alrahma-updated.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'رقم هاتف المؤسسة',
    example: '+966112345678',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'حالة المؤسسة',
    enum: InstitutionStatus,
    example: InstitutionStatus.ACTIVE,
    required: false
  })
  @IsOptional()
  @IsEnum(InstitutionStatus)
  status?: InstitutionStatus;
}