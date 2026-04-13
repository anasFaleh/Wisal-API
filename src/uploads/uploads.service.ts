import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
5;
import { promises as fs } from 'fs';
@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async setBeneficiaryProfileImage(benId: string, img: string) {
    const ben = await this.prisma.beneficiary.findUnique({
      where: { id: benId },
    });
    if (!ben) throw new NotFoundException('Beneficiary Not Found');

    if (!img) throw new BadRequestException('No Image Uploaded');

    return this.prisma.beneficiary.update({
      where: { id: benId },
      data: { profileImage: img },
    });
  }

  async setPostImages(postId: string, imgs: string[]) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post Not Found');

    if (imgs.length === 0) throw new BadRequestException('No Images Uploaded');

    return this.prisma.post.update({
      where: { id: postId },
      data: { images: imgs },
    });
  }

  async getBeneficiaryProfileImage(benId: string) {
    const ben = await this.prisma.beneficiary.findUnique({
      where: { id: benId },
    });
    if (!ben) throw new NotFoundException('Beneficiary Not Found');
    if (!ben.profileImage)
      throw new NotFoundException('No profile Image For This Beneficiary');

    return ben.profileImage;
  }

  async getPostImgs(postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post Not Found');

    if (post.images.length === 0)
      throw new NotFoundException('No Image Found For This Post');

    return post.images;
  }

  async deletePostImage(postId: string, imageName: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    if (!post.images.includes(imageName)) {
      throw new NotFoundException('Image not found in this post');
    }

    const updatedImages = post.images.filter((img) => img !== imageName);
    const filePath = `${process.cwd()}/images/posts/${imageName}`;
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
      } else {
        throw err;
      }
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { images: updatedImages },
    });
  }

  async deleteProfileImage(beneficiaryId: string): Promise<void> {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });

    if (!beneficiary) throw new NotFoundException('Beneficiary not found');
    if (!beneficiary.profileImage)
      throw new NotFoundException('There is no profile image for this user');

    const filePath = `${process.cwd()}/images/profile/${beneficiary.profileImage}`;

    try {
      await fs.unlink(filePath);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
      } else {
        throw err;
      }
    }

    await this.prisma.beneficiary.update({
      where: { id: beneficiaryId },
      data: { profileImage: null },
    });
  }
}
