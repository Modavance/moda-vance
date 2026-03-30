import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateContactDto) { return this.contactService.create(dto); }
}
