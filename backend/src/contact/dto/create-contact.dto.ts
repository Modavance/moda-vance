import { IsEmail, IsString, MaxLength } from 'class-validator';
export class CreateContactDto {
  @IsString() @MaxLength(100) name!: string;
  @IsEmail() email!: string;
  @IsString() @MaxLength(200) subject!: string;
  @IsString() @MaxLength(2000) message!: string;
}
