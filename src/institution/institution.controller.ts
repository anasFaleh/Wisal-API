import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import { UpdateInstitutionDto } from './dto';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Emp } from '../common/enums';

@ApiTags('Institutions')
@Controller('institutions')
@UseGuards(JwtGuard, RolesGuard)
@ApiSecurity('bearer')

export class InstitutionController {
  constructor(private readonly institutionsService: InstitutionService) { }

  @Get('search')
  @ApiOperation({ summary: 'Search institutions by name or email' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search query (e.g., part of institution name or email)',
    example: 'Wisal',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching institutions',
  })
  search(@Query('q') query: string) {
    return this.institutionsService.searchInstitutions(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific institution' })
  @ApiResponse({
    status: 200,
    description: 'Institution found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Institution not found',
  })
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get status for a specific institution' })
  @ApiResponse({
    status: 200,
    description: 'Institution status retrieved successfully',
  })
  getStatus(@Param('id') id: string) {
    return this.institutionsService.getInstitutionStatus(id);
  }

  @Put(':id')
  @Roles(Emp.ADMIN)
  @ApiOperation({ summary: 'Update institution details (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Institution updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can update institutions',
  })
  update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto) {
    return this.institutionsService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  @Roles(Emp.ADMIN)
  @ApiOperation({ summary: 'Delete an institution (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Institution deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can delete institutions',
  })
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }
}
