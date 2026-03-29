import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactAdminController } from './contact.controller.admin';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController, ContactAdminController],
  providers: [ContactService],
})
export class ContactModule {}
