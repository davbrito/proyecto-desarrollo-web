import { Injectable, NotImplementedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Response } from "express";
import { User } from "../users/user.entity.js";
import { UsersService } from "../users/users.service.js";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_MAX_AGE,
} from "./auth.constants.js";
import { AuthResponseDto, SignUpDto } from "./auth.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createTokens(userId: string, username: string, role: string) {
    const payload = { sub: userId, username, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(user: User, res: Response) {
    const tokens = await this.createTokens(user.id, user.username, user.role);

    this.setRefreshTokenCookie(tokens.refresh_token, res);

    return new AuthResponseDto({
      accessToken: tokens.access_token,
      user,
    });
  }

  async register(signUpDto: SignUpDto, res: Response) {
    const user = await this.usersService.create(signUpDto);
    return await this.login(user, res);
  }

  async refreshToken(userId: string, res: Response) {
    throw new NotImplementedException();
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return null;

    const isValid = await user.validatePassword(password);
    if (!isValid) return null;

    return user;
  }

  /** Set the refresh token cookie on an Express response. */
  setRefreshTokenCookie(token: string, res: Response): void {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}
