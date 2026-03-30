import { IsInt, IsOptional, IsString, Min } from 'class-validator';
export class CreateFaqDto {
  @IsString() section!: string;
  @IsString() question!: string;
  @IsString() answer!: string;
  @IsOptional() @IsInt() @Min(0) order?: number;
}
