import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFamilyMemberDto, UpdateFamilyMemberDto } from './dto';

@Injectable()
export class FamilyMemberService {
  constructor(private prisma: PrismaService) {}

  async create(
    beneficiaryId: string,
    createFamilyMemberDto: CreateFamilyMemberDto,
  ) {
    const ben = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });
    if (!ben) throw new NotFoundException('Beneficiary Not Found');

    const existingMember = await this.prisma.familyMember.findFirst({
      where: {
        beneficiaryId,
        nationalId: createFamilyMemberDto.nationalId,
      },
    });

    if (existingMember)
      throw new ConflictException('Family Member Is Already Exists');

    return this.prisma.familyMember.create({
      data: {
        ...createFamilyMemberDto,
        beneficiaryId,
      },
    });
  }

  async findAll(beneficiaryId: string) {
    const ben = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
      include: { familyMembers: true },
    });
    if (!ben) throw new NotFoundException('Beneficiary Not Found');
    return ben.familyMembers;
  }

  async update(id: string, updateFamilyMemberDto: UpdateFamilyMemberDto) {
    const familyMember = await this.prisma.familyMember.findUnique({
      where: { id },
    });

    if (!familyMember) throw new NotFoundException('Family Member Not Found');

    if (updateFamilyMemberDto.nationalId) {
      const existingMember = await this.prisma.familyMember.findFirst({
        where: {
          beneficiaryId: familyMember.beneficiaryId,
          nationalId: updateFamilyMemberDto.nationalId,
          NOT: { id },
        },
      });

      if (existingMember)
        throw new ConflictException('This national id is Already Exists');
    }

    return this.prisma.familyMember.update({
      where: { id },
      data: updateFamilyMemberDto,
    });
  }

  async remove(id: string) {
    const familyMember = await this.prisma.familyMember.findUnique({
      where: { id },
    });
    if (!familyMember) throw new NotFoundException('Family Member Not Found');

    return this.prisma.familyMember.delete({ where: { id } });
  }

  async findOne(id: string) {
    const familyMember = await this.prisma.familyMember.findUnique({
      where: { id },
    });
    if (!familyMember) throw new NotFoundException('Family Member Not Found');

    return familyMember;
  }
}
