import { applyDecorators, UseGuards } from "@nestjs/common";
import { LocalGuard } from "../guards/local.guard.js";
import { RoleEnum } from "../../users/user.entity.js";
import { RolesGuard } from "../guards/role.guard.js";
import { Roles } from "./roles.decorator.js";

export function Auth(roles: RoleEnum) {
  return applyDecorators(UseGuards(LocalGuard, RolesGuard), Roles(roles));
}
