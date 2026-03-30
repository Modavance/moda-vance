import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);
  constructor(private readonly prisma: PrismaService) {}

  findAll() { return this.prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }); }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post not found: ${slug}`);
    return post;
  }

  async create(dto: CreatePostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already exists');
    const post = await this.prisma.blogPost.create({ data: dto });
    this.logger.log(`Blog post created: ${post.id}`);
    return post;
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.findById(id);
    return this.prisma.blogPost.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.blogPost.delete({ where: { id } });
  }

  private async findById(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post not found: ${id}`);
    return post;
  }
}
