import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
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
    description:
      'Password for the account. Min 8 characters, must include uppercase, lowercase, and a number.',
    example: 'Secure@123',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
