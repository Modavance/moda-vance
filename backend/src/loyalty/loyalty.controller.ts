import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('info')
  getInfo(@Req() req: { user: { userId: string } }) {
    return this.loyaltyService.getInfo(req.user.userId);
  }

  @Post('redeem')
  redeem(@Req() req: { user: { userId: string } }) {
    return this.loyaltyService.redeem(req.user.userId);
  }
}
