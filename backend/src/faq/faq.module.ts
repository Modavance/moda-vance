import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqAdminController } from './faq.controller.admin';
import { FaqService } from './faq.service';

@Module({
  controllers: [FaqController, FaqAdminController],
  providers: [FaqService],
})
export class FaqModule {}
