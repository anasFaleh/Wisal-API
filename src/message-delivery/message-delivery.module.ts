import { Module } from '@nestjs/common';
import { MessageDeliveryController } from './message-delivery.controller';
import { MessageDeliveryService } from './message-delivery.service';

@Module({
  controllers: [MessageDeliveryController],
  providers: [MessageDeliveryService],
})
export class MessageDeliveryModule {}
