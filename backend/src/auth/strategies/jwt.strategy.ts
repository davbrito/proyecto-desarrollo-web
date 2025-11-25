import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "../../users/user.entity.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: TokenPayload) {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
