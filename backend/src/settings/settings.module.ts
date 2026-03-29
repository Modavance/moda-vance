import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsAdminController } from './settings.controller.admin';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController, SettingsAdminController],
  providers: [SettingsService],
})
export class SettingsModule {}
