import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedResult } from '../common/dto/paginated-response.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductFilterDto): Promise<PaginatedResult<unknown>> {
    const { page = 1, limit = 20, search, category, brand, featured, inStock, sortBy } = query;

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { shortDescription: { contains: search } },
        ],
      }),
      ...(category && { category }),
      ...(brand && { brand }),
      ...(featured !== undefined && { featured }),
      ...(inStock !== undefined && { inStock }),
    };

    const orderBy = this.buildOrderBy(sortBy);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: { variants: { orderBy: { sortOrder: 'asc' } } },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: { featured: true, inStock: true },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: { orderBy: { sortOrder: 'asc' } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!product) throw new NotFoundException(`Product '${slug}' not found`);
    return product;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const { variants, images, effects, ...productData } = dto;
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        images: images as unknown as Prisma.InputJsonValue,
        effects: effects as unknown as Prisma.InputJsonValue,
        variants: { create: variants },
      },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    });
    this.logger.log(`Product created: ${product.id}`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    const { variants, images, effects, ...productData } = dto;

    const updateData: Prisma.ProductUpdateInput = {
      ...productData,
      ...(images && { images: images as unknown as Prisma.InputJsonValue }),
      ...(effects && { effects: effects as unknown as Prisma.InputJsonValue }),
    };

    if (variants) {
      await this.prisma.productVariant.deleteMany({ where: { productId: id } });
      updateData.variants = { create: variants };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.product.delete({ where: { id } });
    this.logger.log(`Product deleted: ${id}`);
  }

  private buildOrderBy(sortBy?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case 'rating': return { rating: 'desc' };
      case 'newest': return { createdAt: 'desc' };
      default: return { createdAt: 'desc' };
    }
  }
}
