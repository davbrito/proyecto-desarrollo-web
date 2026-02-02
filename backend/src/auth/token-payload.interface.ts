import type { RoleEnum } from "@uneg-lab/api-types/auth";

export interface TokenPayload {
  sub: string;
  username: string;
  role: RoleEnum;
}
