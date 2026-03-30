import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('faq')
@Public()
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  findAll() { return this.faqService.findAllGrouped(); }
}
