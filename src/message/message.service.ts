import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BeneficiariesDto, CreateMessageDto, UpdateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: createMessageDto.institutionId },
    });

    if (!institution) throw new NotFoundException('Institution Not Found');

    const message = await this.prisma.message.create({
      data: createMessageDto,
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        round: {
          include: {
            distribution: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    return message;
  }

  async findAll(institutionId: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) throw new NotFoundException('Institution Not Found');

    return this.prisma.message.findMany({
      where: { institutionId },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        round: {
          include: {
            distribution: {
              select: {
                title: true,
              },
            },
          },
        },
        MessageDelivery: {
          select: {
            id: true,
            beneficiary: {
              select: {
                id: true,
                fullName: true,
              },
            },
            readAt: true,
          },
        },
        _count: {
          select: {
            MessageDelivery: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
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
        MessageDelivery: {
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
        },
      },
    });

    if (!message) throw new NotFoundException('Message Not Found');

    return message;
  }

  /**
   *
   * @param id
   * @param updateMessageDto
   * @returns
   */
  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) throw new NotFoundException('Message Not Found');

    if (message.status === 'SENT')
      throw new BadRequestException('Can Not Update Already Sent Messages');

    return this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  async remove(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        MessageDelivery: true,
      },
    });

    if (!message) throw new NotFoundException('Message Not Found');

    return this.prisma.$transaction([
      this.prisma.messageDelivery.deleteMany({ where: { messageId: id } }),
      this.prisma.message.delete({ where: { id } }),
    ]);
  }

  /**
   *
   * @param id
   * @returns
   */
  async changeMessageStatusToSent(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        MessageDelivery: true,
      },
    });

    if (!message) throw new NotFoundException('Message Not Found');

    if (message.status === 'SENT')
      throw new BadRequestException('Message Already Sent');

    return this.prisma.message.update({
      where: { id },
      data: {
        status: 'SENT',
      },
    });
  }

  async getMessageStats(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        MessageDelivery: true,
      },
    });

    if (!message) throw new NotFoundException('Message Not Found');

    const total = message.MessageDelivery.length;
    const read = message.MessageDelivery.filter(
      (d) => d.readAt !== null,
    ).length;

    return {
      total,
      read,
      unread: total - read,
      readRate: total > 0 ? (read / total) * 100 : 0,
    };
  }

  //====================
  //  Helper Functions
  //====================

  /**
   *
   * @param messageId
   * @param dto
   */
  async sendMessageToBeneficiaries(messageId: string, dto: BeneficiariesDto) {
    await this.prisma.$transaction(async (tx) => {
      const message = await tx.message.findUnique({
        where: { id: messageId },
      });
      if (!message) throw new NotFoundException('Message Not Found!');

      const beneficiaries = await tx.beneficiary.findMany({
        where: { id: { in: dto.beneficiaryIds } },
      });

      if (beneficiaries.length !== dto.beneficiaryIds.length) {
        throw new ConflictException('One or More Beneficiary IDs are Invalid');
      }

      const deliveries = dto.beneficiaryIds.map((beneficiaryId) => ({
        messageId,
        beneficiaryId,
      }));

      await tx.messageDelivery.createMany({ data: deliveries });
    });
  }

  /**
   *
   * @param messageId
   * @param roundId
   */
  async sendMessageToRoundBeneficiaries(messageId: string, roundId: string) {
    await this.prisma.$transaction(async (tx) => {
      const [round, message] = await Promise.all([
        tx.round.findUnique({ where: { id: roundId } }),
        tx.message.findUnique({ where: { id: messageId } }),
      ]);

      if (!round) throw new NotFoundException('Round Not Found');
      if (!message) throw new NotFoundException('Message Not Found');

      const beneficiaries = await tx.roundBeneficiary.findMany({
        where: { roundId },
        select: { beneficiaryId: true },
      });

      const deliveries = beneficiaries.map((b) => ({
        messageId,
        beneficiaryId: b.beneficiaryId,
      }));

      if (deliveries.length > 0) {
        await tx.messageDelivery.createMany({ data: deliveries });
      }
    });
  }
}
