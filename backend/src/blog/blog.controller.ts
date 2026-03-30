import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('blog')
@Public()
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() { return this.blogService.findAll(); }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.blogService.findBySlug(slug); }
}
