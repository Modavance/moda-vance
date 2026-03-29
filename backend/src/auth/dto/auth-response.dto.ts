export class AuthUserDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
}

export class AuthResponseDto {
  token!: string;
  user!: AuthUserDto;
}
