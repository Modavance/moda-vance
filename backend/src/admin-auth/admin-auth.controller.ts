import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '../common/decorators/public.decorator';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('admin-auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto);
  }

  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth('admin-jwt')
  @Get('me')
  getMe(@GetUser() admin: { adminId: string }) {
    return this.adminAuthService.getMe(admin.adminId);
  }

  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth('admin-jwt')
  @Put('profile')
  updateProfile(
    @GetUser() admin: { adminId: string },
    @Body() dto: UpdateAdminProfileDto,
  ) {
    return this.adminAuthService.updateProfile(admin.adminId, dto);
  }

  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth('admin-jwt')
  @Put('password')
  changePassword(
    @GetUser() admin: { adminId: string },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.adminAuthService.changePassword(admin.adminId, dto);
  }
}
