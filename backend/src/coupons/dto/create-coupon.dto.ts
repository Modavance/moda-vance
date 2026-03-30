import { IsDateString, IsEnum, IsNumber, IsString, Matches, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { CouponType } from '@prisma/client';
export class CreateCouponDto {
  @IsString() @Matches(/^[A-Z0-9_-]+$/) @Transform(({ value }: { value: string }) => value?.toUpperCase()) code!: string;
  @IsNumber() @Min(0) discount!: number;
  @IsEnum(CouponType) type!: CouponType;
  @IsNumber() @Min(0) minOrder!: number;
  @IsDateString() expiresAt!: string;
}
