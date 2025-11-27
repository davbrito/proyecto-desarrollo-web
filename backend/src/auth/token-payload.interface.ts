import { RoleEnum } from "../users/user.entity.js";

export interface TokenPayload {
  sub: string;
  username: string;
  role: RoleEnum;
}
