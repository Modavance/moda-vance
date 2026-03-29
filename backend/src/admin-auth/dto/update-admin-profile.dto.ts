import { IsEmail } from 'class-validator';

export class UpdateAdminProfileDto {
  @IsEmail()
  email!: string;
}
