import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
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
    example: 'Secure@123',
    description:
      'Admin password. Min 8 characters, must include uppercase, lowercase, and a number.',
    minLength: 8,
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  adminPassword: string;
}
