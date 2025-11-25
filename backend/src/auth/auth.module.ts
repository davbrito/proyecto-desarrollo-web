import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { LocalStrategy } from "./strategies/local.strategy.js";

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: false }),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
    }
  }
}
