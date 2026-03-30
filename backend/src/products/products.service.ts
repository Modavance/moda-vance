import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductFilterDto, ProductSort } from './dto/product-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductFilterDto) {
    const { page = 1, limit = 20, search, category, sort } = query;
    const where: Prisma.ProductWhereInput = {
      ...(category && { category }),
      ...(search && { OR: [{ name: { contains: search } }, { shortDescription: { contains: search } }] }),
    };
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === ProductSort.NAME_ASC) orderBy = { name: 'asc' };
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, include: { variants: { orderBy: { sortOrder: 'asc' } } } }),
      this.prisma.product.count({ where }),
    ]);
    return { data: data.map(this.castJsonFields), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findFeatured() {
    const products = await this.prisma.product.findMany({ where: { featured: true, inStock: true }, include: { variants: { orderBy: { sortOrder: 'asc' } } } });
    return products.map(this.castJsonFields);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug }, include: { variants: { orderBy: { sortOrder: 'asc' } }, reviews: { orderBy: { createdAt: 'desc' } } } });
    if (!product) throw new NotFoundException(`Product not found: ${slug}`);
    return this.castJsonFields(product);
  }

  async create(dto: CreateProductDto) {
    const { variants, images, effects, ...rest } = dto;
    const product = await this.prisma.product.create({
      data: { ...rest, images: images as unknown as Prisma.InputJsonValue, effects: effects as unknown as Prisma.InputJsonValue, variants: { create: variants.map((v, i) => ({ ...v, sortOrder: v.sortOrder ?? i })) } },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    });
    this.logger.log(`Product created: ${product.id}`);
    return this.castJsonFields(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    const { variants, images, effects, ...rest } = dto;
    const product = await this.prisma.product.update({
      where: { id },
      data: { ...rest, ...(images && { images: images as unknown as Prisma.InputJsonValue }), ...(effects && { effects: effects as unknown as Prisma.InputJsonValue }), ...(variants && { variants: { deleteMany: {}, create: variants.map((v, i) => ({ ...v, sortOrder: v.sortOrder ?? i })) } }) },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    });
    return this.castJsonFields(product);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.product.delete({ where: { id } });
    this.logger.log(`Product deleted: ${id}`);
  }

  private async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product not found: ${id}`);
    return product;
  }

  private castJsonFields<T extends { images: unknown; effects: unknown }>(p: T) {
    return { ...p, images: p.images as string[], effects: p.effects as string[] };
  }
}
