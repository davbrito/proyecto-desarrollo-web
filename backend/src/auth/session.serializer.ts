import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import type { User } from "../users/user.entity.js";
import { UsersService } from "../users/users.service.js";

export interface SessionUserPayload {
  id: string;
}

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
  ) {
    super();
  }

  serializeUser(
    user: User,
    done: (err: Error | null, payload: SessionUserPayload) => void,
  ) {
    // const req = this.request;
    // const userAgent = req.headers["user-agent"];
    // const ipAddress = (req.headers["x-forwarded-for"] ||
    //   req.socket.remoteAddress ||
    //   "") as string;
    done(null, {
      id: user.id,
      // userAgent,
      // ipAddress,
    });
  }

  /**
   * Obtiene el usuario completo a partir del ID de la sesión. Se llama en CADA
   * petición autenticada.
   */
  async deserializeUser(
    payload: SessionUserPayload,
    done: (err: Error | null, user: User | null) => void,
  ) {
    const user = await this.usersService.findOne(payload.id);
    done(null, user);
  }
}
