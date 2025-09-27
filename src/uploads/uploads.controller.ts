import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiConsumes,
  ApiBody 
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { JwtGuard } from 'src/auth/guards';

@ApiTags('File Uploads')
@ApiBearerAuth('JWT-auth')
@Controller('uploads')
@UseGuards(JwtGuard)
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('profile')
  @ApiOperation({ 
    summary: 'Upload profile image', 
    description: 'Upload a profile image for the authenticated beneficiary' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile image file',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, etc.)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({ 
    status: 201, 
    description: 'Profile image uploaded successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid file format or size' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('id') benId: string,
  ) {
    return this.uploadsService.setBeneficiaryProfileImage(benId, file.filename);
  }

  @Post('post/:id')
  @ApiOperation({ 
    summary: 'Upload post images', 
    description: 'Upload multiple images for a specific post' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post image files',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of image files',
        },
      },
    },
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @UseInterceptors(FilesInterceptor('image'))
  @ApiResponse({ 
    status: 201, 
    description: 'Post images uploaded successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid file format or size' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Post not found' 
  })
  uploadPostImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', new ParseUUIDPipe()) postId: string,
  ) {
    return this.uploadsService.setPostImages(
      postId,
      files.map((img) => img.filename),
    );
  }

  @Get('profile')
  @ApiOperation({ 
    summary: 'Get beneficiary profile image', 
    description: 'Get the profile image of the authenticated beneficiary' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile image retrieved successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Profile image not found' 
  })
  async getBeneficiaryProfileImage(@GetUser('id') benId: string) {
    return this.uploadsService.getBeneficiaryProfileImage(benId);
  }

  @Get('profile/:id')
  @ApiOperation({ 
    summary: 'Get beneficiary profile image by ID', 
    description: 'Get the profile image of a specific beneficiary by their ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Beneficiary ID',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile image retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Beneficiary or profile image not found' 
  })
  async getprofileImage(@Param('id', new ParseUUIDPipe()) benId: string) {
    return this.uploadsService.getBeneficiaryProfileImage(benId);
  }

  @Get('post/:id')
  @ApiOperation({ 
    summary: 'Get post images', 
    description: 'Get all images associated with a specific post' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Post images retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Post not found' 
  })
  async getPostImages(@Param('id', new ParseUUIDPipe()) postId: string) {
    return this.uploadsService.getPostImgs(postId);
  }

  @Delete('post/:postId/image/:imageName')
  @ApiOperation({ 
    summary: 'Delete post image', 
    description: 'Delete a specific image from a post' 
  })
  @ApiParam({ 
    name: 'postId', 
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiParam({ 
    name: 'imageName', 
    description: 'Image file name',
    example: 'image.jpg' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Image deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Image deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Post or image not found' 
  })
  async deletePostImage(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Param('imageName') imageName: string,
  ) {
    await this.uploadsService.deletePostImage(postId, imageName);
    return { success: true, message: 'Image deleted successfully' };
  }

  @Delete('profile-image')
  @ApiOperation({ 
    summary: 'Delete profile image', 
    description: 'Delete the profile image of the authenticated beneficiary' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile image deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Profile image deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Profile image not found' 
  })
  async deleteProfileImage(@GetUser('id') id: string) {
    await this.uploadsService.deleteProfileImage(id);
    return { success: true, message: 'Profile image deleted successfully' };
  }
}