import { IsString, IsInt, Min } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  section!: string;

  @IsString()
  question!: string;

  @IsString()
  answer!: string;

  @IsInt()
  @Min(0)
  order!: number;
}
