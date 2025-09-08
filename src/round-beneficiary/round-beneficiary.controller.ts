import { Controller, Post, Get, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AllocateBeneficiariesDto, DeliverCouponDto } from './dto';
import { RoundBeneficiaryService } from './round-beneficiary.service';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Emp } from '../common/enums';
import { ApiSecurity, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Round Beneficiaries')
@ApiSecurity('bearer')
@Controller('rounds/:roundId/allocations')
@UseGuards(JwtGuard, RolesGuard)
export class RoundBeneficiaryController {
  constructor(private readonly roundBeneficiariesService: RoundBeneficiaryService) {}

  @Post()
  @Roles(Emp.ADMIN, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Allocate beneficiaries to a round (Admin, Distributer)' })
  @ApiParam({ name: 'roundId', description: 'Round ID (UUID)' })
  @ApiResponse({ status: 201, description: 'Beneficiaries allocated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  allocate(
    @Param('roundId', new ParseUUIDPipe()) roundId: string,
    @Body() allocateDto: AllocateBeneficiariesDto
  ) {
    return this.roundBeneficiariesService.allocate(roundId, allocateDto);
  }

  @Get()
  @Roles(Emp.ADMIN, Emp.DELIVERER, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Get all allocations for a round (Admin, Distributer, Deliverer)' })
  @ApiParam({ name: 'roundId', description: 'Round ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Allocations returned successfully' })
  getAllocations(@Param('roundId', new ParseUUIDPipe()) roundId: string) {
    return this.roundBeneficiariesService.getRoundAllocations(roundId);
  }

  @Post('deliver')
  @Roles(Emp.ADMIN, Emp.DELIVERER)
  @ApiOperation({ summary: 'Deliver a coupon to a beneficiary (Admin, Deliverer)' })
  @ApiResponse({ status: 200, description: 'Coupon delivered successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  deliverCoupon(@Body() deliverCouponDto: DeliverCouponDto) {
    return this.roundBeneficiariesService.deliverCoupon(deliverCouponDto);
  }

  @Get('stats/:roundId')
  @Roles(Emp.ADMIN, Emp.DELIVERER, Emp.DISTRIBUTER)
  @ApiOperation({ summary: 'Get delivery statistics for a round (Admin, Distributer, Deliverer)' })
  @ApiParam({ name: 'roundId', description: 'Round ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Statistics returned successfully' })
  getStats(@Param('roundId', new ParseUUIDPipe()) roundId: string) {
    return this.roundBeneficiariesService.getDeliveryStats(roundId);
  }

  @Get('search/:couponCode')
  @Roles(Emp.ADMIN, Emp.DELIVERER)
  @ApiOperation({ summary: 'Search for a delivered coupon by its code (Admin, Deliverer)' })
  @ApiParam({ name: 'couponCode', description: 'Coupon code to search for' })
  @ApiResponse({ status: 200, description: 'Coupon found successfully' })
  searchByCouponCode(@Param('couponCode') couponCode: string) {
    return this.roundBeneficiariesService.searchByCouponCode(couponCode);
  }
}
