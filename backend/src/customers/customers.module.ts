import { Module } from '@nestjs/common';
import { CustomersAdminController } from './customers.controller.admin';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersAdminController],
  providers: [CustomersService],
})
export class CustomersModule {}
