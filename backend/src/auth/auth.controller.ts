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
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { ZodResponse } from "nestjs-zod";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/services/users.service";
import { PermissionEnum } from "./auth.permissions";
import { AuthService } from "./auth.service";
import { Auth } from "./decorators/auth.decorator";
import { AuthResponseDto } from "./dtos/auth-response.dto";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { UserDto } from "./dtos/user.dto";
import { LocalGuard } from "./guards/local.guard";
import { UserMapper } from "./mappers/user.mapper";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    @Inject(UsersService)
    private userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ZodResponse({ type: AuthResponseDto })
  @UseGuards(LocalGuard)
  async login(
    @Body() _loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Cast user to User type only here.
    // Because LocalStrategy returns the whole user object
    const user = req.user as any as User;
    return await this.authService.login(user, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  @ZodResponse({ type: AuthResponseDto })
  async register(
    @Body() signUpDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(signUpDto, res);
  }

  @Auth(PermissionEnum.CREATE_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post("register/admin")
  async registerAdmin(@Body() signUpDto: RegisterDto) {
    return await this.authService.registerAdmin(signUpDto);
  }

  @Post("refresh")
  @ZodResponse({ type: AuthResponseDto })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refreshToken(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res);
  }

  @Auth()
  @Get("me")
  @ZodResponse({ type: UserDto })
  async getProfile(@Req() req: Request): Promise<UserDto> {
    const user = await this.userService.findOne(req.user!.id);
    if (!user) throw new NotFoundException("User not found");
    return UserMapper.toDto(user);
  }
}
