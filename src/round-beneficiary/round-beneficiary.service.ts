import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AllocateBeneficiariesDto } from './dto';
import { Prisma } from '@prisma/client';
import { DeliverCouponDto } from './dto/deliverCoupon.dto';

@Injectable()
export class RoundBeneficiaryService {
  constructor(private prisma: PrismaService) {}

  async allocate(roundId: string, allocateDto: AllocateBeneficiariesDto) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: {
        distribution: {
          include: {
            couponTemplate: true,
          },
        },
      },
    });

    if (!round) throw new NotFoundException('Round Not Found');

    // number of beneficiaries should be <= number of coupons
    const existingAllocationsCount = await this.prisma.roundBeneficiary.count({
      where: { roundId },
    });

    const totalRequested =
      existingAllocationsCount + allocateDto.beneficiaryIds.length;
    if (totalRequested > round.couponCount) {
      throw new ConflictException(
        `Number of beneficiaries exceed the number of Coupons ${round.couponCount - existingAllocationsCount}`,
      );
    }

    const beneficiaries = await this.prisma.beneficiary.findMany({
      where: {
        id: { in: allocateDto.beneficiaryIds },
        active: true,
      },
    });

    if (beneficiaries.length !== allocateDto.beneficiaryIds.length) {
      throw new NotFoundException('Some Beneficiaries No Found Or Not Active');
    }

    const allocations: Prisma.RoundBeneficiaryCreateManyInput[] = [];
    for (const beneficiaryId of allocateDto.beneficiaryIds) {
      const couponCode = this.generateCouponCode(
        round.distribution.couponTemplate.type,
        round.roundNumber,
      );

      allocations.push({
        roundId,
        beneficiaryId,
        couponCode,
        expiresAt: round.endDate,
      });
    }

    return this.prisma.roundBeneficiary.createMany({
      data: allocations,
    });
  }

  async getRoundAllocations(roundId: string) {
    return this.prisma.roundBeneficiary.findMany({
      where: { roundId },
      include: {
        beneficiary: {
          select: {
            id: true,
            fullName: true,
            nationalId: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deliverCoupon(deliverCouponDto: DeliverCouponDto) {
    const allocation = await this.prisma.roundBeneficiary.findUnique({
      where: { couponCode: deliverCouponDto.couponCode },
      include: {
        beneficiary: true,
        round: {
          include: {
            distribution: {
              include: {
                couponTemplate: true,
              },
            },
          },
        },
      },
    });

    if (!allocation) throw new NotFoundException('Invalid Coupon Code');

    if (allocation.status === 'DELIVERED')
      throw new ConflictException('This Coupon Is Already DELIVERED');

    if (allocation.expiresAt && new Date() > allocation.expiresAt) {
      throw new ConflictException('Expired Coupon');
    }

    return this.prisma.roundBeneficiary.update({
      where: { id: allocation.id },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
      },
      include: {
        beneficiary: {
          select: {
            fullName: true,
            nationalId: true,
          },
        },
        round: {
          include: {
            distribution: {
              include: {
                couponTemplate: true,
              },
            },
          },
        },
      },
    });
  }

  async getDeliveryStats(roundId: string) {
    const allocations = await this.prisma.roundBeneficiary.findMany({
      where: { roundId },
      select: {
        status: true,
        deliveredAt: true,
      },
    });

    const total = allocations.length;
    const delivered = allocations.filter(
      (a) => a.status === 'DELIVERED',
    ).length;
    const pending = allocations.filter((a) => a.status === 'PENDING').length;

    return {
      total,
      delivered,
      pending,
      deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
    };
  }

  async searchByCouponCode(couponCode: string) {
    const roundBen = await this.prisma.roundBeneficiary.findUnique({
      where: { couponCode },
      include: {
        beneficiary: {
          select: {
            id: true,
            fullName: true,
            nationalId: true,
            phone: true,
          },
        },
        round: {
          include: {
            distribution: {
              include: {
                couponTemplate: true,
                institution: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!roundBen) throw new NotFoundException('Round Beneficiary Not Found!');
    return roundBen;
  }

  private generateCouponCode(couponType: string, roundNumber: number): string {
    const prefix = couponType.substring(0, 2).toUpperCase();
    const randomPart = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `${prefix}-R${roundNumber}-${randomPart}`;
  }
}
