import { ApiPropertyOptional } from "@nestjs/swagger";
import { MessageType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateMessageDto{
    @ApiPropertyOptional({ example: 'Message title', description: 'The title of the message' })
    @IsString()
    title: string;
  
    @ApiPropertyOptional({ example: 'Message content...', description: 'The body/content of the message' })
    @IsString()
    content: string;
  
    @ApiPropertyOptional({ 
      enum: MessageType, 
      example: MessageType.NOTIFICATION, 
      description: 'The type of the message (e.g., NOTIFICATION, ALERT, REMINDER)' 
    })
    @IsEnum(MessageType)
    type: MessageType;
  
    @ApiPropertyOptional({ example: 'institution-id-123', description: 'The ID of the institution' })
    @IsString()
    institutionId: string;
  
    @ApiPropertyOptional({ 
      example: 'round-id-123', 
      description: 'The ID of the round (optional)',
      required: false 
    })
    @IsOptional()
    @IsString()
    roundId?: string;
  
}
