import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FilterBeneficiariesDto, UpdateBeneficiaryDto } from "./dto";

@Injectable()
export class BeneficiaryService {
  constructor(
    private prisma: PrismaService
  ) { }


  /**
   * 1.beneficiary exists
   * @param id 
   * @returns beneficiary
   */
  async findById(id: string) {
    const ben = await this.prisma.beneficiary.findUnique({
      where: { id },
      include: { allocations: true, familyMembers: true }
    });
    if (!ben) throw new NotFoundException('Beneficiary Not Found');
    return ben;
  }




  /**
   * 1.beneficiary exists
   * @param nationalId 
   * @returns beneficiary
   */
  async getBeneficiaryByNationalId(nationalId: string) {
    const ben = await this.prisma.beneficiary.findUnique({ where: { nationalId: nationalId } });
    if (!ben) throw new NotFoundException('Beneficiray Not Found');
    return ben;
  }



  /**
   * get beneficiary coupons
   * @param id 
   * @returns coupons
   */
  async getCoupons(id: string) {
    const coupons = await this.prisma.roundBeneficiary.findMany({
      where: { beneficiaryId: id },
      include: { round: { include: { distribution: { include: { institution: true } } } } }
    });
    if (coupons.length === 0) throw new NotFoundException('No Coupons Found For this Beneficiary');

    return coupons;
  }



  /**
   * 1.beneficiary exists
   * 2.update beneficiary
   * @param benId 
   * @param dto 
   * @returns message
   */
  async updateBeneficiary(benId: string, dto: UpdateBeneficiaryDto) {
    const ben = await this.prisma.beneficiary.findUnique({ where: { id: benId } });
    if (!ben) throw new NotFoundException('Beneficiray Not Found');

    await this.prisma.beneficiary.update({
      where: { id: benId },
      data: dto
    });

    return { message: 'Beneficiray Updated Successfully' }
  }



  async filterBeneficiaries(filters: FilterBeneficiariesDto) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Build where conditions
    const whereConditions = this.buildWhereConditions(filters);

    // Get total count with all filters except family size (which is computed)
    const totalCount = await this.prisma.beneficiary.count({
      where: whereConditions,
    });

    // Get beneficiaries with pagination
    const beneficiaries = await this.prisma.beneficiary.findMany({
      where: whereConditions,
      include: { familyMembers: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // Add sensible default ordering
    });

    // Apply family size filtering
    const filteredBeneficiaries = this.filterByFamilySize(beneficiaries, filters);

    return {
      data: filteredBeneficiaries,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      filteredCount: filteredBeneficiaries.length, // Added filtered count for clarity
    };
  }


  async searchBeneficiray(name: string) {
    const bens = await this.prisma.beneficiary.findMany({
      where: { fullName: { contains: name, mode: 'insensitive' } }
    });
    if (bens.length === 0) throw new NotFoundException('No Beneficiaries With This Name');
    return bens;
  }


  private filterByFamilySize(beneficiaries: any[], filters: FilterBeneficiariesDto) {
    return beneficiaries.filter((beneficiary) => {
      const familySize = beneficiary.familyMembers.length + 1;

      if (filters.minFamilySize && familySize < filters.minFamilySize) {
        return false;
      }

      if (filters.maxFamilySize && familySize > filters.maxFamilySize) {
        return false;
      }

      return true;
    });
  }
  
  private buildWhereConditions(filters: FilterBeneficiariesDto) {
    const conditions: any[] = [];

    // Health Status filter
    if (filters.healthStatus) {
      conditions.push({
        OR: [
          { healthStatus: filters.healthStatus },
          { familyMembers: { some: { healthStatus: filters.healthStatus } } },
        ],
      });
    }

    // Housing Status filter
    if (filters.housingStatus) {
      conditions.push({ housingStatus: filters.housingStatus });
    }

    // Income range filter
    if (filters.minIncome !== undefined || filters.maxIncome !== undefined) {
      const incomeCondition: any = {};

      if (filters.minIncome !== undefined) {
        incomeCondition.gte = filters.minIncome;
      }

      if (filters.maxIncome !== undefined) {
        incomeCondition.lte = filters.maxIncome;
      }

      conditions.push({ income: incomeCondition });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  }
  
 
}
