import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const submission = await this.prisma.contactSubmission.create({ data: dto });
    this.logger.log(`Contact submission: ${submission.id}`);
    return submission;
  }

  findAll(read?: boolean) {
    return this.prisma.contactSubmission.findMany({
      where: read !== undefined ? { read } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const s = await this.prisma.contactSubmission.findUnique({ where: { id } });
    if (!s) throw new NotFoundException(`Submission not found: ${id}`);
    return s;
  }

  async markRead(id: string, read: boolean) {
    await this.findById(id);
    return this.prisma.contactSubmission.update({ where: { id }, data: { read } });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.contactSubmission.delete({ where: { id } });
  }
}
