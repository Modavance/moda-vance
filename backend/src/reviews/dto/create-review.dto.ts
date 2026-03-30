import { IsInt, IsString, Max, Min } from 'class-validator';
export class CreateReviewDto {
  @IsString() productId!: string;
  @IsString() title!: string;
  @IsString() body!: string;
  @IsInt() @Min(1) @Max(5) rating!: number;
}
