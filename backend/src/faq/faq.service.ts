import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.faqItem.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] });
  }

  async create(dto: CreateFaqDto) {
    return this.prisma.faqItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateFaqDto) {
    const item = await this.prisma.faqItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`FAQ item ${id} not found`);
    return this.prisma.faqItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const item = await this.prisma.faqItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`FAQ item ${id} not found`);
    await this.prisma.faqItem.delete({ where: { id } });
  }
}
