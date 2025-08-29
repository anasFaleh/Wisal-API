// rounds.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoundDto, UpdateRoundDto } from './dto';

@Injectable()
export class RoundService {
  constructor(private prisma: PrismaService) { }

  async create(distributionId: string, createRoundDto: CreateRoundDto) {
    const distribution = await this.prisma.distribution.findUnique({
      where: { id: distributionId },
    });

    if (!distribution) throw new NotFoundException('Distrivbution Not Found');


    const existingRound = await this.prisma.round.findFirst({
      where: {
        distributionId,
        roundNumber: createRoundDto.roundNumber,
      },
    });

    if (existingRound) throw new ConflictException('Round With Same Number Is Found');



    if (createRoundDto.startDate && new Date(createRoundDto.startDate) > new Date(createRoundDto.endDate)) {
      throw new BadRequestException('EndDate Should Be After StartDate');
    }

    return this.prisma.round.create({
      data: {
        ...createRoundDto,
        distributionId,
      },
      include: {
        distribution: {
          include: {
            couponTemplate: true
          }
        }
      }
    });
  }



  async findAll(distributionId: string) {
    const distribution = await this.prisma.distribution.findUnique({
      where: { id: distributionId },
    });
    if (!distribution) throw new NotFoundException('Distrivbution Not Found');


    return this.prisma.round.findMany({
      where: { distributionId },
      include: {
        allocations: {
          include: {
            beneficiary: {
              select: {
                id: true,
                fullName: true,
                nationalId: true
              }
            }
          }
        },
        _count: {
          select: {
            allocations: true
          }
        }
      },
      orderBy: { roundNumber: 'asc' }
    });
  }


  async findOne(id: string) {
    const round = await this.prisma.round.findUnique({
      where: { id },
      include: {
        distribution: {
          include: {
            couponTemplate: true,
            institution: true
          }
        },
        allocations: {
          include: {
            beneficiary: {
              select: {
                id: true,
                fullName: true,
                nationalId: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!round) throw new NotFoundException('Round Not Found');

    return round;
  }



  async update(id: string, updateRoundDto: UpdateRoundDto) {

    const round = await this.prisma.round.findUnique({
      where: { id },
    });
    if (!round) throw new NotFoundException('Round Not Found');


    if (updateRoundDto.roundNumber && updateRoundDto.roundNumber !== round.roundNumber) {
      const existingRound = await this.prisma.round.findFirst({
        where: {
          distributionId: round.distributionId,
          roundNumber: updateRoundDto.roundNumber,
          NOT: { id }
        },
      });

      if (existingRound) if (existingRound) throw new ConflictException('Round With Same Number Is Found');

    }

    // Dates Check
    if (updateRoundDto.startDate && updateRoundDto.endDate) {
      if (new Date(updateRoundDto.startDate) > new Date(updateRoundDto.endDate)) {
        throw new BadRequestException('EndDate Should Be After StartDate');
      }
    }

    return this.prisma.round.update({
      where: { id },
      data: updateRoundDto,
      include: {
        distribution: {
          include: {
            couponTemplate: true
          }
        }
      }
    });
  }


  async remove(id: string) {

    const round = await this.prisma.round.findUnique({
      where: { id },
      include: {
        allocations: true
      }
    });

    if (!round) throw new NotFoundException('Round Not Found');


    if (round.allocations.length > 0) throw new ConflictException('Cant Delete This Round (it contains specfications)');

    return this.prisma.round.delete({
      where: { id },
    });
  }


  async getRoundStats(id: string) {
    const round = await this.prisma.round.findUnique({
      where: { id },
      include: {
        allocations: true
      }
    });

    if (!round) throw new NotFoundException('Round Not Found');


    const totalAllocations = round.allocations.length;
    const delivered = round.allocations.filter(a => a.status === 'DELIVERED').length;
    const pending = round.allocations.filter(a => a.status === 'PENDING').length;

    return {
      roundNumber: round.roundNumber,
      totalAllocations,
      delivered,
      pending,
      utilizationRate: (totalAllocations / round.couponCount) * 100,
      deliveryRate: totalAllocations > 0 ? (delivered / totalAllocations) * 100 : 0
    };
  }
}