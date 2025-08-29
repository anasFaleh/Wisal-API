import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { FilterBeneficiariesDto, UpdateBeneficiaryDto } from './dto';
import { JwtGuard } from 'src/auth/guards';

@Controller('beneficiaries')
@UseGuards(JwtGuard)
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.beneficiaryService.findById(id);
  }

  @Get('coupon/:couponCode')
  async getBeneficiaryByCouponCode(@Param('couponCode') couponCode: string) {
    return this.beneficiaryService.getBeneficiaryByCouponCode(couponCode);
  }

  @Get('national/:nationalId')
  async getBeneficiaryByNationalId(@Param('nationalId') nationalId: string) {
    return this.beneficiaryService.getBeneficiaryByNationalId(nationalId);
  }

  @Get(':id/coupons')
  async getCoupons(@Param('id') id: string) {
    return this.beneficiaryService.getCoupons(id);
  }

  @Patch(':id')
  async updateBeneficiary(
    @Param('id') id: string,
    @Body() dto: UpdateBeneficiaryDto,
  ) {
    return this.beneficiaryService.updateBeneficiary(id, dto);
  }

  @Get()
  async filterBeneficiaries(@Query() filters: FilterBeneficiariesDto) {
    return this.beneficiaryService.filterBeneficiaries(filters);
  }

  @Get('search/:name')
  async searchBeneficiary(@Param('name') name: string) {
    return this.beneficiaryService.searchBeneficiray(name);
  }

  @Get(':id/messages')
  async findBeneficiaryMessages(@Param('id') id: string) {
    return this.beneficiaryService.findBeneficiaryMessages(id);
  }
}
