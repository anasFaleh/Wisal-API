import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { JwtGuard } from 'src/auth/guards';

@Controller('coupons')
@UseGuards(JwtGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async create(
    @Body() dto: CreateCouponDto,
    @GetUser('institutionId') institutionId: string,
  ) {
    return this.couponService.create({ ...dto, institutionId });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponService.update(id, dto);
  }

  @Get()
  async findAll(@GetUser('institutionId') institutionId: string) {
    return this.couponService.findAll(institutionId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
