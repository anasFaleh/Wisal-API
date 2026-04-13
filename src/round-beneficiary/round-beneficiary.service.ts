import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
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

    // Validate all beneficiaries exist and are active before entering the transaction
    const beneficiaries = await this.prisma.beneficiary.findMany({
      where: {
        id: { in: allocateDto.beneficiaryIds },
        active: true,
      },
    });

    if (beneficiaries.length !== allocateDto.beneficiaryIds.length) {
      throw new NotFoundException('Some Beneficiaries Not Found Or Not Active');
    }

    // Build allocations array outside the transaction — pure computation
    const allocations: Prisma.RoundBeneficiaryCreateManyInput[] =
      allocateDto.beneficiaryIds.map((beneficiaryId) => ({
        roundId,
        beneficiaryId,
        couponCode: this.generateCouponCode(
          round.distribution.couponTemplate.type,
          round.roundNumber,
        ),
        expiresAt: round.endDate,
      }));

    // Count + insert inside a transaction to prevent concurrent requests
    // from exceeding the coupon limit
    return this.prisma.$transaction(async (tx) => {
      const existingCount = await tx.roundBeneficiary.count({
        where: { roundId },
      });

      const totalRequested = existingCount + allocateDto.beneficiaryIds.length;
      if (totalRequested > round.couponCount) {
        throw new ConflictException(
          `Cannot allocate: only ${round.couponCount - existingCount} coupon(s) remaining`,
        );
      }

      return tx.roundBeneficiary.createMany({ data: allocations });
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
    const randomPart = randomBytes(6).toString('hex').toUpperCase();
    return `${prefix}-R${roundNumber}-${randomPart}`;
  }
}
