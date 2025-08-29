import { Controller, Get, Post, Put, Delete, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import { UpdateInstitutionDto } from './dto';

@ApiTags('Institutions')
@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionsService: InstitutionService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))

 
  @Get('search')
  search(@Query('q') query: string) {
    return this.institutionsService.searchInstitutions(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.institutionsService.getInstitutionStats(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto) {
    return this.institutionsService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }
}