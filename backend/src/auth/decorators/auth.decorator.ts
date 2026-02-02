import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PermissionEnum } from "../auth.permissions";
import { AuthenticatedGuard } from "../guards/authenticated.guard";
import { PermissionsGuard } from "../guards/permissions.guard";
import { RequirePermissions } from "./permissions.decorator";

export function Auth(...permissions: PermissionEnum[]) {
  return applyDecorators(
    RequirePermissions(...permissions),
    UseGuards(AuthenticatedGuard, PermissionsGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Unauthorized" }),
  );
}
