import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { Public } from '../common/decorators/public.decorator';

@Public()
@ApiTags('admin-orders')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/orders')
export class OrdersAdminController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() query: OrderFilterDto) { return this.ordersService.findAll(query); }

  @Get(':id')
  findById(@Param('id') id: string) { return this.ordersService.findById(id); }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) { return this.ordersService.updateStatus(id, dto); }

  @Get(':id/logs')
  findLogs(@Param('id') id: string) { return this.ordersService.findLogs(id); }
}
