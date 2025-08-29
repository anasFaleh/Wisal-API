// round-beneficiaries.controller.ts
import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { AllocateBeneficiariesDto, DeliverCouponDto } from './dto';
import { RoundBeneficiaryService } from './round-beneficiary.service';

@Controller('rounds/:roundId/allocations')
export class RoundBeneficiaryController {
  constructor(private readonly roundBeneficiariesService: RoundBeneficiaryService) {}

  @Post()
  allocate(
    @Param('roundId') roundId: string,
    @Body() allocateDto: AllocateBeneficiariesDto
  ) {
    return this.roundBeneficiariesService.allocate(roundId, allocateDto);
  }

  @Get()
  getAllocations(@Param('roundId') roundId: string) {
    return this.roundBeneficiariesService.getRoundAllocations(roundId);
  }

   @Post('deliver')
  deliverCoupon(@Body() deliverCouponDto: DeliverCouponDto) {
    return this.roundBeneficiariesService.deliverCoupon(deliverCouponDto);
  }

  @Get('stats/:roundId')
  getStats(@Param('roundId') roundId: string) {
    return this.roundBeneficiariesService.getDeliveryStats(roundId);
  }

  @Get('search/:couponCode')
  searchByCouponCode(@Param('couponCode') couponCode: string) {
    return this.roundBeneficiariesService.searchByCouponCode(couponCode);
  }

  
}