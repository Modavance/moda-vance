import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';

@ApiTags('admin-analytics')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary() {
    return this.analyticsService.getSummary();
  }

  @Get('orders-by-day')
  getOrdersByDay(@Query('days') days?: number) {
    return this.analyticsService.getOrdersByDay(days ? Number(days) : 30);
  }
}
