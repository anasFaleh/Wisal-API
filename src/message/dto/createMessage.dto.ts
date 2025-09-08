import { IsString, IsOptional, IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import { MessageType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Message title', description: 'The title of the message' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Message content...', description: 'The body/content of the message' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    enum: MessageType, 
    example: MessageType.NOTIFICATION, 
    description: 'The type of the message (e.g., NOTIFICATION, ALERT, REMINDER)' 
  })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({ example: 'institution-id-123', description: 'The ID of the institution' })
  @IsString()
  @IsNotEmpty()
  institutionId: string;

  @ApiProperty({ 
    example: 'round-id-123', 
    description: 'The ID of the round (optional)',
    required: false 
  })
  @IsOptional()
  @IsString()
  roundId?: string;

  
}
