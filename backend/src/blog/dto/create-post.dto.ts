import { IsString, IsInt, IsPositive } from 'class-validator';

export class CreatePostDto {
  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsString()
  excerpt!: string;

  @IsString()
  body!: string;

  @IsString()
  image!: string;

  @IsString()
  author!: string;

  @IsString()
  category!: string;

  @IsInt()
  @IsPositive()
  readTime!: number;
}
