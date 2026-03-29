import {
  IsString,
  IsEnum,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Brand, Category, ProductBadge } from '@prisma/client';

export class CreateVariantDto {
  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  savings?: number;

  @IsOptional()
  @IsString()
  label?: string;

  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsEnum(Brand)
  brand!: Brand;

  @IsEnum(Category)
  category!: Category;

  @IsString()
  strength!: string;

  @IsInt()
  @IsPositive()
  pillsPerStrip!: number;

  @IsString()
  description!: string;

  @IsString()
  shortDescription!: string;

  @IsString()
  image!: string;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @IsArray()
  @IsString({ each: true })
  effects!: string[];

  @IsString()
  ingredients!: string;

  @IsString()
  manufacturer!: string;

  @IsOptional()
  @IsEnum(ProductBadge)
  badge?: ProductBadge;

  @IsBoolean()
  inStock!: boolean;

  @IsBoolean()
  featured!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];
}
