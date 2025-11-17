import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ms } from "ms";
import { Session } from "../users/user.entity.js";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./local.strategy.js";
import { SessionSerializer } from "./session.serializer.js";
import { SessionStore, SessionStoreOptions } from "./session.store.js";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Session]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionSerializer,
    LocalStrategy,
    SessionStore,
    {
      provide: "SessionStoreOptions",
      useFactory: (): SessionStoreOptions => ({
        cleanupLimit: 100,
        ttl: ms("7d") / 1000,
      }),
    },
  ],
})
export class AuthModule {}
