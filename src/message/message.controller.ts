import { 
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe 
} from '@nestjs/common';
import { 
  ApiTags, ApiResponse, ApiSecurity, ApiOperation, ApiParam, ApiBody 
} from '@nestjs/swagger';
import { MessagesService } from './message.service';
import { BeneficiariesDto, CreateMessageDto, UpdateMessageDto } from './dto';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Emp } from '../common/enums';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtGuard, RolesGuard)
@ApiSecurity('bearer')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Create a new message (Admin, Distributer)' })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: 201, description: 'Message successfully created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get('institution/:institutionId')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Get all messages for an institution (Admin, Distributer)' })
  @ApiParam({ name: 'institutionId', description: 'Institution ID (UUID)' })
  @ApiResponse({ status: 200, description: 'List of messages returned successfully' })
  findAll(@Param('institutionId', new ParseUUIDPipe()) institutionId: string) {
    return this.messagesService.findAll(institutionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Message returned successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.messagesService.findOne(id);
  }

  @Put(':id')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Update a message (Admin, Distributer)' })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiBody({ type: UpdateMessageDto })
  @ApiResponse({ status: 200, description: 'Message updated successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Delete a message (Admin, Distributer)' })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.messagesService.remove(id);
  }

  @Post(':id/status')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Change Message Status To Sent (Admin, Distributer)' })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  changeMessageStatusToSent(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.messagesService.changeMessageStatusToSent(id);
  }

  @Get(':id/stats')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Get statistics for a message (Admin, Distributer)' })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Message statistics returned successfully' })
  getStats(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.messagesService.getMessageStats(id);
  }

  @Post(':id/send')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Send message to array of Beneficiareis (IDs) (Admin, Distributer)' })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Message or not found' })
  sendMessageToBeneficiaries(@Param('id', new ParseUUIDPipe()) id: string, dto: BeneficiariesDto){
    return this.sendMessageToBeneficiaries(id, dto);
  }


  @Post(':messageId/:roundId')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Send message to beneficiaries of Round (Admin, Distributer)' })
  @ApiParam({ name: 'messageId', description: 'Message ID (UUID)' })
  @ApiParam({ name: 'roundId', description: 'Round ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Message or Round not found' })
  sendMessageToRoundBeneficiaries(@Param('id', new ParseUUIDPipe()) messageId: string, @Param('id', new ParseUUIDPipe()) roundId: string ){
    return this.sendMessageToRoundBeneficiaries(messageId, roundId);
  }

}
