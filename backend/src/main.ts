import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module.js";
import passport from "passport";
import session from "express-session";
import { ms } from "ms";
import { SessionStore } from "./auth/session.store.js";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const cookieSecret = configService.getOrThrow<string>("COOKIE_SECRET");
  app.use(cookieParser(cookieSecret));
  app.use(
    session({
      secret: cookieSecret,
      cookie: {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: ms("7d"),
      },
      resave: false,
      saveUninitialized: false,
      store: app.get(SessionStore),
    }),
  );
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle("Sistema de Reservas de Laboratorio")
    .setDescription("API para la gestión de reservas de laboratorio")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
