import { Type } from "class-transformer";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { User } from "../users/user.entity.js";

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minSymbols: 0 })
  password: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

export class AuthResponseDto {
  accessToken: string;

  @Type(() => User)
  user: User;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
