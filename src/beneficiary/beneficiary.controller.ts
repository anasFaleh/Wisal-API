import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { BeneficiaryService } from './beneficiary.service';
import { FilterBeneficiariesDto, UpdateBeneficiaryDto } from './dto';
import { JwtGuard } from '../auth/guards';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Emp } from '../common/enums';
import { ActiveGuard } from 'src/common/guards';

@ApiTags('Beneficiaries')
@ApiSecurity('bearer')
@UseGuards(JwtGuard, RolesGuard)
@Controller('beneficiaries')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get beneficiary by ID' })
  @ApiParam({ name: 'id', description: 'Beneficiary ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Beneficiary details returned successfully',
  })
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.beneficiaryService.findById(id);
  }

  @Get('national/:nationalId')
  @ApiOperation({ summary: 'Get beneficiary by national ID' })
  @ApiParam({ name: 'nationalId', description: 'National ID number' })
  async getBeneficiaryByNationalId(@Param('nationalId') nationalId: string) {
    return this.beneficiaryService.getBeneficiaryByNationalId(nationalId);
  }

  @Get(':id/coupons')
  @ApiOperation({ summary: 'Get coupons associated with a beneficiary' })
  @ApiParam({ name: 'id', description: 'Beneficiary ID (UUID)' })
  async getCoupons(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.beneficiaryService.getCoupons(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update beneficiary details' })
  @ApiParam({ name: 'id', description: 'Beneficiary ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Beneficiary updated successfully' })
  async updateBeneficiary(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBeneficiaryDto,
  ) {
    return this.beneficiaryService.updateBeneficiary(id, dto);
  }

  @Get()
  @UseGuards(ActiveGuard)
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({
    summary: 'Filter beneficiaries with optional criteria (Admin, Distributer)',
  })
  @ApiQuery({ name: 'healthStatus', required: false })
  @ApiQuery({ name: 'housingStatus', required: false })
  @ApiQuery({ name: 'minIncome', required: false })
  @ApiQuery({ name: 'maxIncome', required: false })
  @ApiQuery({ name: 'minFamilySize', required: false })
  @ApiQuery({ name: 'maxFamilySize', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async filterBeneficiaries(@Query() filters: FilterBeneficiariesDto) {
    return this.beneficiaryService.filterBeneficiaries(filters);
  }

  @Get('search/:name')
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({
    summary: 'Search beneficiaries by name (Admin, Distributer)',
  })
  @ApiQuery({ name: 'name', description: 'Beneficiary full name or partial' })
  async searchBeneficiary(@Query('name') name: string) {
    return this.beneficiaryService.searchBeneficiray(name);
  }
}
