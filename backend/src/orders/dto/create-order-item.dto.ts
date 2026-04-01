import { IsString, IsInt, IsPositive, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsString() productId!: string;
  @IsOptional() @IsString() productName?: string;
  @IsString() variantId!: string;
  @IsInt() @IsPositive() quantity!: number;
  @IsOptional() @IsInt() pillCount?: number;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsString() image?: string;
}
