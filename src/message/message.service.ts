import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) { }

  async create(createMessageDto: CreateMessageDto) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: createMessageDto.institutionId },
    });

    if (!institution) throw new NotFoundException('Institution Not Found');


    const round = await this.prisma.round.findUnique({
      where: { id: createMessageDto.roundId },
      include: { allocations: true }
    });

    if (!round) throw new NotFoundException('Round Not Found');

    const beneficiaryIds = round.allocations.map((ben) => ben.beneficiaryId);

    const message = await this.prisma.message.create({
      data: {
        title: createMessageDto.title,
        content: createMessageDto.content,
        type: createMessageDto.type,
        institutionId: createMessageDto.institutionId,
        roundId: createMessageDto.roundId,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        },
        round: {
          include: {
            distribution: {
              select: {
                title: true
              }
            }
          }
        }
      }
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
            name: true
          }
        },
        round: {
          include: {
            distribution: {
              select: {
                title: true
              }
            }
          }
        },
        MessageDelivery: {
          select: {
            id: true,
            beneficiary: {
              select: {
                id: true,
                fullName: true
              }
            },
            readAt: true
          }
        },
        _count: {
          select: {
            MessageDelivery: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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
            email: true
          }
        },
        round: {
          include: {
            distribution: {
              include: {
                couponTemplate: true
              }
            }
          }
        },
        MessageDelivery: {
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

    if (!message) throw new NotFoundException('Message Not Found');

    return message;
  }


  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) throw new NotFoundException('Message Not Found');




    if (message.status === 'SENT') throw new BadRequestException('Can Not Update Already Sent Messages');

    return this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
      include: {
        institution: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }


  async remove(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        MessageDelivery: true
      }
    });

    if (!message) throw new NotFoundException('Message Not Found');

    if (message.MessageDelivery.length > 0) {
      await this.prisma.messageDelivery.deleteMany({
        where: { messageId: id }
      });
    }

    return this.prisma.message.delete({
      where: { id },
    });
  }


  async sendMessage(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        MessageDelivery: true
      }
    });

    if (!message) throw new NotFoundException('Message Not Found');

    if (message.status === 'SENT') throw new BadRequestException('Message Already Sent');

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
        MessageDelivery: true
      }
    });

    if (!message) throw new NotFoundException('Message Not Found');

    const total = message.MessageDelivery.length;
    const read = message.MessageDelivery.filter(d => d.readAt !== null).length;

    return {
      total,
      read,
      unread: total - read,
      readRate: total > 0 ? (read / total) * 100 : 0
    };
  }



  //====================
  //  Helper Functions
  //====================



  async createMessageDeliveries(messageId: string, beneficiaryIds: string[]) {
    const deliveries = beneficiaryIds.map(beneficiaryId => ({
      messageId,
      beneficiaryId
    }));

    await this.prisma.messageDelivery.createMany({
      data: deliveries
    });
  }

  async sendMessageToRoundBeneficiaries(messageId: string, roundId: string) {
    const beneficiaries = await this.prisma.roundBeneficiary.findMany({
      where: { roundId },
      select: { beneficiaryId: true }
    });

    const deliveries = beneficiaries.map(b => ({
      messageId,
      beneficiaryId: b.beneficiaryId
    }));

    if (deliveries.length > 0) {
      await this.prisma.messageDelivery.createMany({
        data: deliveries
      });
    }
  }
}