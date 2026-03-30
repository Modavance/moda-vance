import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findAll() { return this.prisma.faqItem.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] }); }

  async findAllGrouped() {
    const items = await this.findAll();
    return items.reduce<Record<string, typeof items>>((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});
  }

  async create(dto: CreateFaqDto) {
    const item = await this.prisma.faqItem.create({ data: dto });
    this.logger.log(`FAQ item created: ${item.id}`);
    return item;
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.findById(id);
    return this.prisma.faqItem.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.faqItem.delete({ where: { id } });
  }

  private async findById(id: string) {
    const item = await this.prisma.faqItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`FAQ item not found: ${id}`);
    return item;
  }
}
