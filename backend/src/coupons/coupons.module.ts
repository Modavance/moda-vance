import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsAdminController } from './coupons.controller.admin';
import { CouponsService } from './coupons.service';

@Module({
  controllers: [CouponsController, CouponsAdminController],
  providers: [CouponsService],
})
export class CouponsModule {}
