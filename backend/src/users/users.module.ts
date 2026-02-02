import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "./entities/refresh-token.entity";
import { User } from "./entities/user.entity";
import { UsersService } from "./services/users.service";
import { UsersController } from "./users.controller";
import { RefreshTokenService } from "./services/refresh-token.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [UsersController],
  providers: [UsersService, RefreshTokenService],
  exports: [UsersService, RefreshTokenService],
})
export class UsersModule {}
