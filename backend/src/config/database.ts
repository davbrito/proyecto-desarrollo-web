import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const __dirname = import.meta.dirname;

export const databaseConfig = registerAs(
  "database",
  () => {
    // Agregar el console.log aquí, dentro de la función
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    console.log("REDIS_URL:", process.env.REDIS_URL);
    
    return {
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [__dirname + "/../**/*.entity{.ts,.js,.mjs}"],
      migrations: [__dirname + "/../migrations/*{.ts,.js,.mjs}"],
      synchronize: false,
      cache: {
        type: "ioredis",
        options: process.env.REDIS_URL,
      },
    } satisfies TypeOrmModuleOptions;
  },
);
