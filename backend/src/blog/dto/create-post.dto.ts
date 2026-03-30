import { IsInt, IsPositive, IsString } from 'class-validator';
export class CreatePostDto {
  @IsString() slug!: string;
  @IsString() title!: string;
  @IsString() excerpt!: string;
  @IsString() body!: string;
  @IsString() image!: string;
  @IsString() author!: string;
  @IsString() category!: string;
  @IsInt() @IsPositive() readTime!: number;
}
