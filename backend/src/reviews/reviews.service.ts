import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateReviewDto, userId?: string) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const review = await this.prisma.review.create({
      data: {
        productId: dto.productId,
        userId: userId ?? null,
        userName: dto.userName,
        rating: dto.rating,
        title: dto.title,
        body: dto.body,
      },
    });

    // Recalculate product rating
    const reviews = await this.prisma.review.findMany({ where: { productId: dto.productId } });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
    });

    return review;
  }

  async remove(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.delete({ where: { id } });
  }
}
