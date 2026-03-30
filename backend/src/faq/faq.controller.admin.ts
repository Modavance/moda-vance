import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';

@ApiTags('admin-faq')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/faq')
export class FaqAdminController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  findAll() { return this.faqService.findAll(); }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateFaqDto) { return this.faqService.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) { return this.faqService.update(id, dto); }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) { return this.faqService.delete(id); }
}
