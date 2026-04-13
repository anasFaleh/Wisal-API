import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRoundDto } from './createRound.dto';
import { RoundStatus } from '../../common/enums';

export class UpdateRoundDto extends PartialType(CreateRoundDto) {
  @ApiProperty({
    enum: RoundStatus,
    example: RoundStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoundStatus)
  status?: RoundStatus;
}
