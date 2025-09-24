import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'عنوان المنشور', description: 'عنوان المنشور' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'محتوى المنشور...', description: 'محتوى المنشور' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'ملخص المنشور',
    description: 'ملخص مختصر',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'رابط الصورة',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'institution-id-123', description: 'معرف المؤسسة' })
  @IsString()
  @IsNotEmpty()
  institutionId: string;
}
