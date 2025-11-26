import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-local";
import { SignInDto } from "../auth.dto.js";
import { AuthService } from "../auth.service.js";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "username" satisfies keyof SignInDto,
      passwordField: "password" satisfies keyof SignInDto,
      session: false,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: "Nombre de usuario o contraseña incorrectos",
        code: "INVALID_CREDENTIALS",
      });
    }
    return user;
  }
}
