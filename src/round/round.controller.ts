// rounds.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RoundService } from './round.service';
import { CreateRoundDto, UpdateRoundDto } from './dto';

@ApiTags('Rounds')
@Controller('distributions/:distributionId/rounds')
export class RoundController {
  constructor(private readonly roundsService: RoundService) {}

  @Post()
  create(
    @Param('distributionId') distributionId: string,
    @Body() createRoundDto: CreateRoundDto
  ) {
    return this.roundsService.create(distributionId, createRoundDto);
  }

  @Get()
  findAll(@Param('distributionId') distributionId: string) {
    return this.roundsService.findAll(distributionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roundsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoundDto: UpdateRoundDto) {
    return this.roundsService.update(id, updateRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roundsService.remove(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.roundsService.getRoundStats(id);
  }
}