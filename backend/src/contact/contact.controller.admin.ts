import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';

@ApiTags('admin-contact')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/contact')
export class ContactAdminController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  findAll(@Query('read') read?: string) {
    const readFilter = read === 'true' ? true : read === 'false' ? false : undefined;
    return this.contactService.findAll(readFilter);
  }

  @Get(':id')
  findById(@Param('id') id: string) { return this.contactService.findById(id); }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Body() body: { read: boolean }) { return this.contactService.markRead(id, body.read); }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) { return this.contactService.delete(id); }
}
