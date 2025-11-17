import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service.js";
import { SignInDto, SignUpDto } from "./auth.dto.js";

@Injectable()
export class AuthService {
  private readonly authSecret: string;

  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.authSecret = configService.getOrThrow<string>("AUTH_SECRET");
  }

  async login(signInDto: SignInDto) {
    const user = await this.usersService.findOneByUsername(signInDto.username);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = await user.validatePassword(signInDto.password);

    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return { user: user.toDTO() };
  }

  async register(signUpDto: SignUpDto) {
    const user = await this.usersService.create(signUpDto);

    return { user: user.toDTO() };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return null;

    const isValid = await user.validatePassword(password);
    if (!isValid) return null;

    return user.toDTO();
  }
}
