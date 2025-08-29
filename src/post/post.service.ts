// posts.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: createPostDto.institutionId },
    });

    if (!institution) throw new NotFoundException('Institution Not Found');

    return this.prisma.post.create({
      data: createPostDto,
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }



  async findAll(institutionId?: string) {
    const where = institutionId ? { institutionId, isDeleted: false } : { isDeleted: false };
    
    return this.prisma.post.findMany({
      where,
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }



  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id, isDeleted: false },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!post) throw new NotFoundException('Post Not Found');
    

    return post;
  }


  
  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id, isDeleted: false },
    });

     if (!post) throw new NotFoundException('Post Not Found');
      
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }


  async remove(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id, isDeleted: false },
    });

    if (!post)  if (!post) throw new NotFoundException('Post Not Found');

    // Soft Delete
    return this.prisma.post.update({
      where: { id },
      data: { isDeleted: true },
    });
  }


  async getInstitutionPosts(institutionId: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) throw new NotFoundException('Institution Not Found');
    
    return this.prisma.post.findMany({
      where: { institutionId, isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }
}