import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get()
  findByProduct(@Query('productId') productId: string) { return this.reviewsService.findByProduct(productId); }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateReviewDto, @GetUser() user: { userId: string; email: string }) {
    return this.reviewsService.create(dto, user.userId, user.email);
  }
}
