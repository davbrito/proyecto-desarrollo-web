import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const __dirname = import.meta.dirname;

export const databaseConfig = registerAs(
  "database",
  () =>
    ({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/../migrations/*{.ts,.js}"],
      synchronize: false,
    }) satisfies TypeOrmModuleOptions,
);
