import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { CreateDistributionDto, UpdateDistributionDto } from './dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Emp } from '../common/enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Distributions (Admin, Distributer)')
@Controller('distributions')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Emp.ADMIN, Emp.DISTRIBUTER)
@ApiSecurity('bearer')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new distribution ' })
  @ApiBody({ type: CreateDistributionDto })
  @ApiResponse({
    status: 201,
    description: 'Distribution created successfully',
  })
  create(
    @GetUser('institutionId') institutionId: string,
    @Body() dto: CreateDistributionDto,
  ) {
    return this.distributionService.create(institutionId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a distribution by ID' })
  @ApiParam({ name: 'id', description: 'Distribution ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Distribution returned successfully',
  })
  @ApiResponse({ status: 404, description: 'Distribution not found' })
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.distributionService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all distributions for the institution' })
  @ApiResponse({
    status: 200,
    description: 'List of distributions returned successfully',
  })
  findAll(@GetUser('institutionId') institutionId: string) {
    return this.distributionService.findAll(institutionId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a distribution)' })
  @ApiParam({ name: 'id', description: 'Distribution ID (UUID)' })
  @ApiBody({ type: UpdateDistributionDto })
  @ApiResponse({
    status: 200,
    description: 'Distribution updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Distribution not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateDistributionDto,
  ) {
    return this.distributionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a distribution' })
  @ApiParam({ name: 'id', description: 'Distribution ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Distribution deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Distribution not found' })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.distributionService.delete(id);
  }
}
