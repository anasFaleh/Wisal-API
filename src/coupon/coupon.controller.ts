import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Emp } from '../common/enums';

@ApiTags('Coupons (Admin, Distributer)')
@ApiSecurity('bearer')
@Controller('coupons')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Emp.ADMIN, Emp.DISTRIBUTER)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({ status: 201, description: 'Coupon successfully created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(
    @Body() dto: CreateCouponDto,
    @GetUser('institutionId') institutionId: string,
  ) {
    return this.couponService.create({ ...dto, institutionId });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Coupon successfully updated' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons for an institution' })
  @ApiResponse({ status: 200, description: 'List of coupons returned' })
  async findAll(@GetUser('institutionId') institutionId: string) {
    return this.couponService.findAll(institutionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Coupon found' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.couponService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Coupon successfully deleted' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.couponService.remove(id);
  }
}
