import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });
    if (!admin || !(await bcrypt.compare(dto.password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: admin.id, email: admin.email });
    this.logger.log(`Admin login: ${admin.email}`);
    return {
      token,
      admin: { id: admin.id, email: admin.email },
    };
  }

  async getMe(adminId: string) {
    return this.prisma.admin.findUniqueOrThrow({ where: { id: adminId } });
  }

  async updateProfile(adminId: string, dto: UpdateAdminProfileDto) {
    return this.prisma.admin.update({
      where: { id: adminId },
      data: { email: dto.email },
    });
  }

  async changePassword(adminId: string, dto: ChangePasswordDto) {
    const admin = await this.prisma.admin.findUniqueOrThrow({
      where: { id: adminId },
    });

    if (!(await bcrypt.compare(dto.currentPassword, admin.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash },
    });
    return { message: 'Password changed successfully' };
  }
}
