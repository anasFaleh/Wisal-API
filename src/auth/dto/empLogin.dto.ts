import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';

export class EmployeeLoginDto {

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
