import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { Public } from '../common/decorators/public.decorator';

@Public()
@ApiTags('admin-settings')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/settings')
export class SettingsAdminController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() { return this.settingsService.findAll(); }

  @Put()
  bulkUpdate(@Body() dto: UpdateSettingsDto) { return this.settingsService.bulkUpdate(dto); }
}
