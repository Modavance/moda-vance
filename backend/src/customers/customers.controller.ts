import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('admin-customers')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) { return this.customersService.findAll(query); }
}
