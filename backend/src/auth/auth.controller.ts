import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import type { Request as RequestType, Response as ResponseType } from "express";
import { User } from "../users/user.entity.js";
import { UsersService } from "../users/users.service.js";
import { REFRESH_TOKEN_COOKIE_NAME } from "./auth.constants.js";
import { SignInDto, SignUpDto } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { AuthenticatedGuard } from "./guards/authenticated.guard.js";
import { LocalGuard } from "./guards/local.guard.js";
import { JwtRefreshGuard } from "./jwt-refresh.guard.js";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    @Inject(UsersService)
    private userService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiBody({ type: SignInDto })
  async login(
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    // Cast user to User type only here.
    // Because LocalStrategy returns the whole user object
    const user = req.user as any as User;
    return await this.authService.login(user, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    return await this.authService.register(signUpDto, res);
  }

  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  async refresh(
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    console.log("cookies:", req.cookies);
    const user = req.user as any;
    return await this.authService.refreshToken(user.id, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: ResponseType) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return { message: "Logged out successfully" };
  }

  @UseGuards(AuthenticatedGuard)
  @Get("me")
  async getProfile(@Request() req: RequestType) {
    const user = await this.userService.findOne(req.user!.id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
