import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInstitutionDto } from './dto';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) { }


  async findOne(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        employees: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true
          }
        },
        distributions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            couponTemplate: {
              select: {
                name: true,
                type: true
              }
            }
          }
        },
        couponTemplates: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            employees: true,
            distributions: true,
            couponTemplates: true,
            posts: true,
            messages: true
          }
        }
      }
    });

    if (!institution) throw new NotFoundException('Institution Not Found');

    return institution;
  }


  async update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        
      }
    });

    if (!institution) throw new NotFoundException('Institution Not Found');

    if (updateInstitutionDto.email && updateInstitutionDto.email !== institution.email) {
      const existingInstitution = await this.prisma.institution.findUnique({
        where: { email: updateInstitutionDto.email },
      });

      if (existingInstitution) throw new ConflictException('This Email Already Exists');
        
    }

    return this.prisma.institution.update({
      where: { id },
      data: updateInstitutionDto,
    });
  }


  async remove(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        employees: true,
        distributions: true,
        couponTemplates: true
      }
    });
    if (!institution) throw new NotFoundException('Institution Not Found');

    return this.prisma.institution.delete({
      where: { id },
    });
  }



  async getInstitutionStatus(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        employees: {
          where: { status: 'ACTIVE' }
        },
        distributions: {
          include: {
            rounds: {
              include: {
                allocations: {
                  where: { status: 'DELIVERED' }
                }
              }
            }
          }
        }
      }
    });

    if (!institution) throw new NotFoundException('Institution Not Found');


    const totalEmployees = institution.employees.length;
    const totalDistributions = institution.distributions.length;

    let totalBeneficiaries = 0;
    let totalDeliveredCoupons = 0;

    institution.distributions.forEach(distribution => {
      distribution.rounds.forEach(round => {
        totalBeneficiaries += round.allocations.length;
        totalDeliveredCoupons += round.allocations.length;
      });
    });

    return {
      totalEmployees,
      totalDistributions,
      totalBeneficiaries,
      totalDeliveredCoupons,
      active: institution.status === 'ACTIVE'
    };
  }


  async searchInstitutions(query: string) {
    return this.prisma.institution.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        _count: {
          select: {
            employees: true,
            distributions: true
          }
        }
      },
      take: 10
    });
  }
}