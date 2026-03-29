import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';

@ApiTags('admin-contact')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/contact')
export class ContactAdminController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.contactService.findAll(query);
  }

  @Get('unread-count')
  getUnreadCount() {
    return this.contactService.getUnreadCount();
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.contactService.markRead(id);
  }

  @Patch('mark-all-read')
  markAllRead() {
    return this.contactService.markAllRead();
  }
}
