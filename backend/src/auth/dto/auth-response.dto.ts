export class AuthUserDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  loyaltyPoints!: number;
}

export class AuthResponseDto {
  token!: string;
  user!: AuthUserDto;
}
