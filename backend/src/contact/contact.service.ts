import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResult } from '../common/dto/paginated-response.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: CreateContactDto) {
    const submission = await this.prisma.contactSubmission.create({ data: dto });
    this.logger.log(`Contact submission: ${submission.id}`);
    return submission;
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<unknown>> {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await Promise.all([
      this.prisma.contactSubmission.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactSubmission.count(),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async markRead(id: string) {
    const item = await this.prisma.contactSubmission.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Submission ${id} not found`);
    return this.prisma.contactSubmission.update({ where: { id }, data: { read: true } });
  }

  async markAllRead() {
    await this.prisma.contactSubmission.updateMany({
      where: { read: false },
      data: { read: true },
    });
  }

  async getUnreadCount() {
    const count = await this.prisma.contactSubmission.count({ where: { read: false } });
    return { count };
  }
}
