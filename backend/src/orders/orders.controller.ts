import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  create(
    @Body() dto: CreateOrderDto,
    @GetUser() user?: { userId: string },
  ) {
    return this.ordersService.create(dto, user?.userId);
  }

  @Get('mine')
  getMyOrders(@GetUser() user: { userId: string }) {
    return this.ordersService.findByUser(user.userId);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }
}
