import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { TokenPayload } from "../token-payload.interface.js";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
