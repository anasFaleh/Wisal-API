// messages.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { MessagesService } from './message.service';
import { CreateMessageDto, UpdateMessageDto } from './dto';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get('institution/:institutionId')
  findAll(@Param('institutionId') institutionId: string) {
    return this.messagesService.findAll(institutionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  @Post(':id/send')
  sendMessage(@Param('id') id: string) {
    return this.messagesService.sendMessage(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.messagesService.getMessageStats(id);
  }
}