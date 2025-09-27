import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from './createPost.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ 
    example: 'Updated Post Title', 
    required: false,
    description: 'Updated post title' 
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Updated post content...', 
    required: false,
    description: 'Updated post content' 
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ 
    example: 'Updated post summary', 
    required: false,
    description: 'Updated post summary' 
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    example: 'https://example.com/new-image.jpg',
    required: false,
    description: 'Updated image URL'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}