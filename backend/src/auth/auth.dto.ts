import { Type } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";
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

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsStrongPassword(
    { minSymbols: 0, minLength: 6, minUppercase: 0, minNumbers: 0 },
    {
      message: "La contraseña debe tener al menos 6 caracteres.",
    },
  )
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
