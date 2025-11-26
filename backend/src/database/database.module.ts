import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "../users/refresh-token.entity.js";
import { User } from "../users/user.entity.js";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.getOrThrow<string>("DATABASE_URL"),
        entities: [User, RefreshToken],
        synchronize: process.env.NODE_ENV !== "production",
      }),
    }),
  ],
})
export class DatabaseModule {}
