// update-message.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMessageDto } from './createMessage.dto';
import { MessageStatus } from '@prisma/client';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @ApiProperty({ enum: MessageStatus, example: MessageStatus.SENT, required: false })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
}