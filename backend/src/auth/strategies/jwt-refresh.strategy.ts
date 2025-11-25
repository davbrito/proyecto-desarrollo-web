import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../../users/user.entity.js";
import { REFRESH_TOKEN_COOKIE_NAME } from "../auth.constants.js";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    return { ...payload, refreshToken };
  }
}
