// allocate-beneficiaries.dto.ts
import { IsArray, IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AllocateBeneficiariesDto {
  @ApiProperty({
    description: 'قائمة معرّفات المستفيدين لتخصيصهم للجولة',
    example: ['beneficiary-id-1', 'beneficiary-id-2', 'beneficiary-id-3'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  beneficiaryIds: string[];
}