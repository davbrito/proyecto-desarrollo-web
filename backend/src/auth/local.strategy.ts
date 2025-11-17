import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { SignInDto } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "username" satisfies keyof SignInDto,
      passwordField: "password" satisfies keyof SignInDto,
      session: true,
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) return null;
    return user;
  }
}
