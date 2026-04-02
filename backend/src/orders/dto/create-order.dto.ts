import { IsArray, IsEnum, IsOptional, IsString, IsNumber, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';
import { CreateOrderItemDto } from './create-order-item.dto';
import { AddressDto } from '../../auth/dto/update-profile.dto';

export class CreateOrderDto {
  @IsOptional() @IsString() userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress!: AddressDto;

  @Transform(({ value }: { value: string }) => value?.toUpperCase())
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional() @IsNumber() subtotal?: number;
  @IsOptional() @IsNumber() shipping?: number;
  @IsOptional() @IsNumber() discount?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.toUpperCase())
  couponCode?: string;
}
