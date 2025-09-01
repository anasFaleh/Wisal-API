import { IsNotEmpty, IsPhoneNumber, IsString, Length, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BeneficiarySignupDto {

  @ApiProperty({
    description: 'Full name of the beneficiary',
    example: 'Anas El-Faleh',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'National ID of the beneficiary',
    example: '123456789',
    minLength: 9,
    maxLength: 9,
  })
  @IsNotEmpty()
  @IsString()
  @Length(9, 9)
  @Matches(/^\d+$/, { message: 'National ID must contain only digits' })
  nationalId: string;

  @ApiProperty({
    description: 'Phone number of the beneficiary',
    example: '+970599123456',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('PS')
  phone: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'secret123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
