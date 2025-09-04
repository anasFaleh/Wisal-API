import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InstitutionSignupDto {
  @ApiProperty({
    example: 'Wisal Organization',
    description: 'The name of the institution',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'contact@wisal.org',
    description: 'The official email of the institution',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: '+972599123456',
    description: 'Phone number of the institution (optional)',
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Omar Khaled',
    description: 'Full name of the institution admin',
  })
  @IsNotEmpty()
  @IsString()
  adminFullName: string;

  @ApiProperty({
    example: 'admin@wisal.org',
    description: 'Admin email address',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  adminEmail: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'Admin password (minimum 6 characters)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  adminPassword: string;
}
