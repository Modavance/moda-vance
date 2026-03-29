import { IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  street!: string;
  city!: string;
  state!: string;
  zipCode!: string;
  country!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  savedAddress?: AddressDto;
}
