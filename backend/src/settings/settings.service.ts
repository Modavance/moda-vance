import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.setting.findMany();
    return settings.reduce<Record<string, string>>((acc, s) => { acc[s.key] = s.value; return acc; }, {});
  }

  async findPayment() {
    const settings = await this.prisma.setting.findMany({ where: { key: { startsWith: 'payment.' } } });
    return settings.reduce<Record<string, string>>((acc, s) => { acc[s.key] = s.value; return acc; }, {});
  }

  async bulkUpdate(dto: UpdateSettingsDto) {
    await this.prisma.$transaction(
      Object.entries(dto.settings).map(([key, value]) =>
        this.prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
      )
    );
    this.logger.log('Settings updated');
    return this.findAll();
  }
}
