// create-message.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import { MessageType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'عنوان الرسالة', description: 'عنوان الرسالة' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'محتوى الرسالة...', description: 'محتوى الرسالة' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    enum: MessageType, 
    example: MessageType.NOTIFICATION, 
    description: 'نوع الرسالة' 
  })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({ example: 'institution-id-123', description: 'معرف المؤسسة' })
  @IsString()
  @IsNotEmpty()
  institutionId: string;

  @ApiProperty({ 
    example: 'round-id-123', 
    description: 'معرف الجولة (اختياري)',
    required: false 
  })
  @IsOptional()
  @IsString()
  roundId?: string;

  @ApiProperty({
    example: ['beneficiary-id-1', 'beneficiary-id-2'],
    description: 'قائمة المستفيدين (اختياري)',
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  beneficiaryIds?: string[];
}