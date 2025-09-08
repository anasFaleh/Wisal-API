import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto';

@Injectable()
export class CouponService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(dto: CreateCouponDto) {

        const institution = await this.prisma.institution.findUnique({ where: { id: dto.institutionId } })
        if (!institution) throw new NotFoundException('Institution Not Found');

        const existingCoupon = await this.prisma.couponTemplate.findFirst({
            where: {
                name: dto.name,
                institutionId: dto.institutionId,
            },
        });

        if (existingCoupon) throw new ConflictException('This Coupon Is Already Exsists For This Institurion');

        return this.prisma.couponTemplate.create({
            data: dto,
        });
    }


    async update(id: string, dto: UpdateCouponDto) {
        const Coupon = await this.prisma.couponTemplate.findUnique({
            where: { id },
        });

        if (!Coupon) throw new NotFoundException('Coupon Not Found');

        if (dto.name && dto.name !== Coupon.name) {
            const existingTemplate = await this.prisma.couponTemplate.findFirst({
                where: {
                    name: dto.name,
                    institutionId: Coupon.institutionId,
                    NOT: { id }
                },
            });

            if (existingTemplate) throw new ConflictException('This Coupon Is Already Exsists For This Institurion');
        }

        return this.prisma.couponTemplate.update({
            where: { id },
            data: dto,
        });
    }


    async findAll(institutionId: string) {
        return this.prisma.couponTemplate.findMany({
            where: { institutionId },
            orderBy: { createdAt: 'desc' },
        });
    }


    async findOne(id: string) {
        const template = await this.prisma.couponTemplate.findUnique({
            where: { id },
        });

        if (!template) {
            throw new NotFoundException('Coupon Not Found');
        }

        return template;
    }


    async remove(id: string) {
        const template = await this.prisma.couponTemplate.findUnique({
            where: { id },
        });

        if (!template) throw new NotFoundException('Coupon Not Found');

        const distributions = await this.prisma.distribution.findMany({
            where: { couponTemplateId: id },
        });

        if (distributions.length > 0) {
            throw new ConflictException('Cant Delete This CouponTemplate Becouse Its related to distribution');
        }

        return this.prisma.couponTemplate.delete({
            where: { id },
        });

    }

    
}

