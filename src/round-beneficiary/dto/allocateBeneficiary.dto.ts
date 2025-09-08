import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AllocateBeneficiariesDto {
  @ApiProperty({
    description: 'List of beneficiary IDs to allocate to the round',
    example: ['beneficiaryId-1 (UUID)', 'beneficiaryId-2 (UUID)'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  beneficiaryIds: string[];
}
