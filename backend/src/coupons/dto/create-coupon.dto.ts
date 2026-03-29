import { IsString, IsNumber, Min, IsEnum, IsDateString } from 'class-validator';
import { CouponType } from '@prisma/client';

export class CreateCouponDto {
  @IsString()
  code!: string;

  @IsNumber()
  @Min(0)
  discount!: number;

  @IsEnum(CouponType)
  type!: CouponType;

  @IsNumber()
  @Min(0)
  minOrder!: number;

  @IsDateString()
  expiresAt!: string;
}
