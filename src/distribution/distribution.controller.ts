import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { CreateDistributionDto, UpdateDistributionDto } from './dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { JwtGuard } from 'src/auth/guards';

@Controller('distributions')
@UseGuards(JwtGuard)
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @Post()
  async create(
    @GetUser('institutionId') institutionId: string,
    @Body() dto: CreateDistributionDto,
  ) {
    return this.distributionService.create(institutionId, dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.distributionService.findById(id);
  }

  @Get()
  async findAll(@GetUser('institutionId') institutionId: string) {
    return this.distributionService.findAll(institutionId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDistributionDto,
  ) {
    return this.distributionService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.distributionService.delete(id);
  }
}
