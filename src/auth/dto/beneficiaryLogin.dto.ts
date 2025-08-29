import { IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BeneficiaryLoginDto {
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
    description: 'Password of the beneficiary',
    example: 'secret123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
