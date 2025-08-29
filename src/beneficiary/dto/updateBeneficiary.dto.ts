import {
    IsString,
    IsOptional,
    IsDateString,
    IsEnum,
    Length,
    Matches,
    IsNumber,
} from 'class-validator';
import { Gender, HealthStatus, HousingStatus } from '@prisma/client';

export class UpdateBeneficiaryDto {

    @IsString()
    @IsOptional()
    @Length(3, 100)
    fullName?: string;


    @IsString()
    @IsOptional()
    @Matches(/^[0-9+\- ]*$/)
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsEnum(HealthStatus)
    @IsOptional()
    healthStatus?: HealthStatus;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: Date;

    @IsEnum(HousingStatus)
    @IsOptional()
    housingStatus?: HousingStatus

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender

    @IsNumber()
    @IsOptional()
    income?: number



}
