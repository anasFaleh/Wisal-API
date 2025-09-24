import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDistributionDto, UpdateDistributionDto } from './dto';

@Injectable()
export class DistributionService {
  constructor(private prisma: PrismaService) {}

  async create(institutionId: string, dto: CreateDistributionDto) {
    const template = await this.prisma.couponTemplate.findUnique({
      where: { id: dto.couponTemplateId },
    });

    if (!template) {
      throw new NotFoundException('Coupon Template Not Found');
    }

    if (template.institutionId !== institutionId) {
      throw new BadRequestException(
        'Coupon Template Does Not Belong To This Institution',
      );
    }

    return this.prisma.distribution.create({
      data: { ...dto, institutionId },
      include: {
        couponTemplate: true,
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const dis = await this.prisma.distribution.findUnique({
      where: { id },
      include: { rounds: true, couponTemplate: true },
    });
    if (!dis) throw new NotFoundException('Distribution Not Found');
    return dis;
  }

  async findAll(institutionId: string) {
    const distributions = await this.prisma.distribution.findMany({
      where: { institutionId: institutionId },
      include: {
        couponTemplate: true,
        rounds: true,
      },
    });
    if (distributions.length === 0)
      throw new NotFoundException('No Distributions Found');
    return distributions;
  }

  async update(id: string, data: UpdateDistributionDto) {
    const dis = await this.prisma.distribution.findUnique({ where: { id } });
    if (!dis) throw new NotFoundException('Distribution Not Found');

    if (dis.status === 'COMPLETED') {
      throw new BadRequestException(
        'Cant Update CANCELLED Or COMPLETED Distribution',
      );
    }

    const couponTemplate = await this.prisma.couponTemplate.findUnique({
      where: { id: data.couponTemplateId },
    });
    if (!couponTemplate)
      throw new NotFoundException('CouponTemplate Not Found!');

    return this.prisma.distribution.update({ where: { id }, data });
  }

  async delete(id: string) {
    const dis = await this.prisma.distribution.findUnique({ where: { id } });
    if (!dis) throw new NotFoundException('Distribution Not Found');
    return this.prisma.distribution.delete({ where: { id } });
  }
}
