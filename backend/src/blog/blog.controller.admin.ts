import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AdminJwtGuard } from '../common/guards/admin-jwt.guard';
import { Public } from '../common/decorators/public.decorator';

@Public()
@ApiTags('admin-blog')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/blog')
export class BlogAdminController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() { return this.blogService.findAll(); }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreatePostDto) { return this.blogService.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) { return this.blogService.update(id, dto); }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) { return this.blogService.delete(id); }
}
