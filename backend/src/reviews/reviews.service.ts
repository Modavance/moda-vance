import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  constructor(private readonly prisma: PrismaService) {}

  findByProduct(productId: string) {
    return this.prisma.review.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateReviewDto, userId: string, userName: string) {
    const [review] = await this.prisma.$transaction([
      this.prisma.review.create({ data: { ...dto, userId, userName, verified: true } }),
    ]);

    const reviews = await this.prisma.review.findMany({ where: { productId: dto.productId } });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await this.prisma.product.update({ where: { id: dto.productId }, data: { rating: avg, reviewCount: reviews.length } });

    this.logger.log(`Review created: ${review.id}`);
    return review;
  }
}
