import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from './createPost.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ example: 'عنوان محدث', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'محتوى محدث...', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'ملخص محدث', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ example: 'https://example.com/new-image.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}