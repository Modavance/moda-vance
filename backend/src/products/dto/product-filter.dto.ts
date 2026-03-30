import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Category } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum ProductSort {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME_ASC = 'name_asc',
  NEWEST = 'newest',
}

export class ProductFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsString()
  sort?: ProductSort;
}
