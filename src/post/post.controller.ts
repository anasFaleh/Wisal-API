import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { PostsService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Emp } from 'src/common/enums';

// Response DTO for Swagger documentation
class PostResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique post ID',
  })
  id: string;

  @ApiProperty({ example: 'Post Title', description: 'Post title' })
  title: string;

  @ApiProperty({ example: 'Post content...', description: 'Post content' })
  content: string;

  @ApiProperty({
    example: 'Post summary',
    description: 'Post summary',
    required: false,
  })
  summary?: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Array of image URLs',
    required: false,
  })
  images?: string[];

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Institution ID',
  })
  institutionId: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}

class PostsListResponseDto {
  @ApiProperty({ type: [PostResponseDto], description: 'List of posts' })
  data: PostResponseDto[];

  @ApiProperty({ example: 10, description: 'Total number of posts' })
  total: number;
}

@ApiTags('Posts ')
@ApiBearerAuth('JWT-auth')
@Controller('posts')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Emp.PUBLISHER)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Create a new post. Requires PUBLISHER role and JWT authentication.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Post creation data',
    examples: {
      basicPost: {
        summary: 'Basic post with images',
        value: {
          title: 'Welcome to Our Platform',
          content: 'This is the content of the post...',
          summary: 'A brief summary of the post',
          images: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
          ],
          institutionId: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
      minimalPost: {
        summary: 'Minimal post without images',
        value: {
          title: 'Simple Post',
          content: 'Post content here',
          institutionId: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have PUBLISHER role',
  })
  @ApiResponse({
    status: 404,
    description: 'Institution not found',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description:
      'Retrieve all posts with optional institution filtering. Requires PUBLISHER role.',
  })
  @ApiQuery({
    name: 'institutionId',
    required: false,
    description: 'Filter posts by institution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: PostsListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have PUBLISHER role',
  })
  findAll(@Query('institutionId') institutionId?: string) {
    return this.postsService.findAll(institutionId);
  }

  @Get('institution/:institutionId')
  @ApiOperation({
    summary: 'Get posts by institution',
    description:
      'Retrieve all posts for a specific institution. Requires PUBLISHER role.',
  })
  @ApiParam({
    name: 'institutionId',
    description: 'Institution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Institution posts retrieved successfully',
    type: PostsListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have PUBLISHER role',
  })
  @ApiResponse({
    status: 404,
    description: 'Institution not found',
  })
  getInstitutionPosts(@Param('institutionId') institutionId: string) {
    return this.postsService.getInstitutionPosts(institutionId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve a specific post by its ID. Requires PUBLISHER role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have PUBLISHER role',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Update an existing post. Requires PUBLISHER role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdatePostDto,
    description: 'Post update data',
    examples: {
      updateTitle: {
        summary: 'Update title only',
        value: {
          title: 'Updated Post Title',
        },
      },
      updateImages: {
        summary: 'Update images only',
        value: {
          images: [
            'https://example.com/new-image1.jpg',
            'https://example.com/new-image2.jpg',
          ],
        },
      },
      fullUpdate: {
        summary: 'Full post update',
        value: {
          title: 'Updated Title',
          content: 'Updated content...',
          summary: 'Updated summary',
          images: [
            'https://example.com/new-image1.jpg',
            'https://example.com/new-image2.jpg',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have PUBLISHER role',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description:
      'Delete a post by ID. This is a soft delete. Requires PUBLISHER role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      example: {
        message: 'Post deleted successfully',
        id: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have PUBLISHER role',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
