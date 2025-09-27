import { IsString, IsOptional, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ 
    example: 'Welcome to Our Platform', 
    description: 'Post title' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'This is the content of the post...', 
    description: 'Post content' 
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'Array of image URLs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Institution ID' 
  })
  @IsString()
  @IsNotEmpty()
  institutionId: string;
}