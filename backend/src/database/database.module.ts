import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session, User } from "../users/user.entity.js";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.getOrThrow<string>("DATABASE_URL"),
        entities: [User, Session],
        synchronize: process.env.NODE_ENV !== "production",
      }),
    }),
  ],
})
export class DatabaseModule {}
