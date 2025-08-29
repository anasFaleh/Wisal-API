// create-round.dto.ts
import { IsInt, IsDateString, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoundDto {
  @ApiProperty({ example: 1, description: 'رقم الجولة' })
  @IsInt()
  @Min(1, { message: 'رقم الجولة يجب أن يكون على الأقل 1' })
  @IsNotEmpty()
  roundNumber: number;

  @ApiProperty({ example: 100, description: 'عدد القسائم في الجولة' })
  @IsInt()
  @Min(1, { message: 'عدد القسائم يجب أن يكون على الأقل 1' })
  @IsNotEmpty()
  couponCount: number;

  @ApiProperty({ example: '2024-04-30T23:59:59Z', description: 'تاريخ نهاية الجولة' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: '2024-03-01T00:00:00Z', description: 'تاريخ بداية الجولة', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;
}