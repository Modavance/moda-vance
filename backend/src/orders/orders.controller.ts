import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateOrderDto) { return this.ordersService.create(dto); }

  @Get('mine')
  findMine(@GetUser() user: { userId: string }) { return this.ordersService.findMine(user.userId); }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) { return this.ordersService.findById(id); }

  @Public()
  @Get(':id/logs')
  findLogs(@Param('id') id: string) { return this.ordersService.findLogs(id); }
}
