import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const where = search ? { OR: [{ email: { contains: search } }, { firstName: { contains: search } }, { lastName: { contains: search } }] } : {};
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, select: { id: true, email: true, firstName: true, lastName: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
