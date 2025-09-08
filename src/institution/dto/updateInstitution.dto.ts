import { IsOptional, IsString, IsEnum, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInstitutionDto {
  
  @ApiPropertyOptional({
    description: 'The name of the institution',
    example: 'Palestine Relief Org',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The email address of the institution',
    example: 'contact@wisal.org',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the institution',
    example: '+970599123456',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
