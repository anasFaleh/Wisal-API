import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class MessageDeliveryService {
  constructor(private prisma: PrismaService) {}

  async markAsRead(deliveryId: string) {
    const delivery = await this.prisma.messageDelivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) throw new NotFoundException('Massage Delivery Not Found');

    return this.prisma.messageDelivery.update({
      where: { id: deliveryId },
      data: {
        readAt: new Date(),
        status: DeliveryStatus.DELIVERED,
      },
      include: {
        message: {
          select: {
            title: true,
            content: true,
            type: true,
          },
        },
        beneficiary: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async getBeneficiaryMessages(beneficiaryId: string) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });

    if (!beneficiary) throw new NotFoundException('Beneficiary Not Found');

    return this.prisma.messageDelivery.findMany({
      where: { beneficiaryId },
      include: {
        message: {
          select: {
            id: true,
            title: true,
            content: true,
            type: true,
            createdAt: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadMessagesCount(beneficiaryId: string) {
    const count = await this.prisma.messageDelivery.count({
      where: {
        beneficiaryId,
        readAt: null,
        status: DeliveryStatus.PENDING, 
      },
    });

    return { count };
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
    errorReason?: string,
  ) {
    const delivery = await this.prisma.messageDelivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) throw new NotFoundException('Message Delivery Not Found');

    const updateData: any = { status };

    if (status === DeliveryStatus.DELIVERED) {
      updateData.readAt = new Date();
    } else if (status === DeliveryStatus.FAILED) {
      updateData.failedAt = new Date();
      updateData.errorReason = errorReason;
    }

    return this.prisma.messageDelivery.update({
      where: { id: deliveryId },
      data: updateData,
    });
  }
}
