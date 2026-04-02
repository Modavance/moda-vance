import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { Public } from '../common/decorators/public.decorator';

@Public()
@ApiTags('admin-coupons')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/coupons')
export class CouponsAdminController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll() { return this.couponsService.findAll(); }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateCouponDto) { return this.couponsService.create(dto); }

  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateCouponDto) { return this.couponsService.update(code, dto); }

  @Delete(':code')
  @HttpCode(204)
  delete(@Param('code') code: string) { return this.couponsService.delete(code); }
}
