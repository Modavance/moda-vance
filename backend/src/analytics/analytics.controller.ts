import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { Public } from '../common/decorators/public.decorator';

@Public()
@ApiTags('admin-analytics')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview') getOverview() { return this.analyticsService.getOverview(); }
  @Get('monthly') getMonthly() { return this.analyticsService.getMonthly(); }
  @Get('payment') getPaymentBreakdown() { return this.analyticsService.getPaymentBreakdown(); }
  @Get('products') getTopProducts() { return this.analyticsService.getTopProducts(); }
}
