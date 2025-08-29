import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class InstitutionSignupDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsOptional()
    phone?: string

    @IsNotEmpty()
    @IsString()
    adminFullName: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    adminEmail: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    adminPassword: string
}