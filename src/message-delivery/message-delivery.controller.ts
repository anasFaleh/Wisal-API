import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { MessageDeliveryService } from './message-delivery.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';

@ApiTags('Message Delivery')
@Controller('message-delivery')
export class MessageDeliveryController {
  constructor(private readonly messageDeliveryService: MessageDeliveryService) {}

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.messageDeliveryService.markAsRead(id);
  }

  @Get('beneficiary/:beneficiaryId')
  getBeneficiaryMessages(@Param('beneficiaryId') beneficiaryId: string) {
    return this.messageDeliveryService.getBeneficiaryMessages(beneficiaryId);
  }

  @Get('beneficiary/:beneficiaryId/unread-count')
  getUnreadCount(@Param('beneficiaryId') beneficiaryId: string) {
    return this.messageDeliveryService.getUnreadMessagesCount(beneficiaryId);
  }

  @Patch(':id/status')
  updateDeliveryStatus(
    @Param('id') id: string,
    @Body() body: { status: DeliveryStatus; errorReason?: string },
  ) {
    return this.messageDeliveryService.updateDeliveryStatus(
      id,
      body.status,
      body.errorReason,
    );
  }
  
}