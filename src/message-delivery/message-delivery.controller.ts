import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessageDeliveryService } from './message-delivery.service';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiSchema,
  ApiSecurity,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards';
import { DeliveryStatus } from '../common/enums';

@ApiTags('Message Delivery')
@Controller('message-delivery')
@ApiSecurity('bearer')
@UseGuards(JwtGuard)
export class MessageDeliveryController {
  constructor(
    private readonly messageDeliveryService: MessageDeliveryService,
  ) {}

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiParam({ name: 'id', description: 'Message delivery ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Message marked as read successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  markAsRead(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.messageDeliveryService.markAsRead(id);
  }

  @Get('beneficiary/:beneficiaryId')
  @ApiOperation({ summary: 'Get all messages for a specific beneficiary' })
  @ApiParam({ name: 'beneficiaryId', description: 'Beneficiary ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'List of messages returned successfully',
  })
  getBeneficiaryMessages(
    @Param('beneficiaryId', new ParseUUIDPipe()) beneficiaryId: string,
  ) {
    return this.messageDeliveryService.getBeneficiaryMessages(beneficiaryId);
  }

  @Get('beneficiary/:beneficiaryId/unread-count')
  @ApiOperation({ summary: 'Get unread messages count for a beneficiary' })
  @ApiParam({ name: 'beneficiaryId', description: 'Beneficiary ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Unread messages count returned successfully',
  })
  getUnreadCount(
    @Param('beneficiaryId', new ParseUUIDPipe()) beneficiaryId: string,
  ) {
    return this.messageDeliveryService.getUnreadMessagesCount(beneficiaryId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update delivery status of a message' })
  @ApiParam({ name: 'id', description: 'Message delivery ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(DeliveryStatus) },
        errorReason: {
          type: 'string',
          example: 'Failed due to invalid phone number',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Delivery status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  updateDeliveryStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { status: DeliveryStatus; errorReason?: string },
  ) {
    return this.messageDeliveryService.updateDeliveryStatus(
      id,
      body.status,
      body.errorReason,
    );
  }
}
