import { IsString, IsInt, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsString() productId!: string;
  @IsString() variantId!: string;
  @IsInt() @IsPositive() quantity!: number;
}
