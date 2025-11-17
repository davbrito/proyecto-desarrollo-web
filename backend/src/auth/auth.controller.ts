import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import type { Request as RequestType, Response as ResponseType } from "express";
import { SignInDto, SignUpDto } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { AuthenticatedGuard } from "./authenticated.guard.js";
import { LocalGuard } from "./local.guard.js";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiBody({ type: SignInDto })
  async login(@Req() req: RequestType) {
    return req.user;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body() signUpDto: SignUpDto, @Req() req: RequestType) {
    const result = await this.authService.register(signUpDto);

    await new Promise((resolve, reject) =>
      req.logIn(result.user, (err) => (err ? reject(err) : resolve(null))),
    );

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@Req() req: RequestType, @Res() res: ResponseType) {
    req.logout((err) => {
      if (err) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Logout failed" });
        throw err;
      }

      res.sendStatus(HttpStatus.OK).json({ message: "ok" }).end();
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get("profile")
  getProfile(@Request() req: RequestType) {
    return req.user;
  }

  private _removeAuthCookie(res: ResponseType): void {
    res.clearCookie("auth_token");
  }
}
