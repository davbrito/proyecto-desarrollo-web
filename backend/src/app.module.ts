import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { databaseConfig } from "./config/database";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { HttpExceptionFilter } from "./http-exception.filter";
import { ReservationsModule } from "./reservations/reservations.module";
import { UsersModule } from "./users/users.module";
import { LaboratoriesModule } from "./laboratories/laboratories.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ReservationsModule,
    HealthModule,
    LaboratoriesModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  controllers: [],
})
export class AppModule {}
