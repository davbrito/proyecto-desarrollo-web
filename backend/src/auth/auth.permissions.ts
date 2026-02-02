import { RoleEnum } from "@uneg-lab/api-types/auth.js";

export enum PermissionEnum {
  // Users
  READ_USERS = "users:read",
  CREATE_USERS = "users:create",
  UPDATE_USERS = "users:update",
  DELETE_USERS = "users:delete",
  CREATE_ADMIN = "users:create_admin",

  // Laboratorios
  READ_LABORATORIES = "laboratories:read",
  CREATE_LABORATORIES = "laboratories:create",
  UPDATE_LABORATORIES = "laboratories:update",
  DELETE_LABORATORIES = "laboratories:delete",

  // Reservas
  READ_RESERVATIONS = "reservations:read",
  CREATE_RESERVATIONS = "reservations:create",
  UPDATE_RESERVATIONS = "reservations:update",
  DELETE_RESERVATIONS = "reservations:delete",
  MANAGE_RESERVATIONS_STATE = "reservations:manage_state",
}

export const ROLE_PERMISSIONS: Record<RoleEnum, PermissionEnum[]> = {
  [RoleEnum.ADMIN]: [
    PermissionEnum.READ_USERS,
    PermissionEnum.CREATE_USERS,
    PermissionEnum.UPDATE_USERS,
    PermissionEnum.DELETE_USERS,

    PermissionEnum.CREATE_ADMIN,

    PermissionEnum.READ_LABORATORIES,
    PermissionEnum.CREATE_LABORATORIES,
    PermissionEnum.UPDATE_LABORATORIES,
    PermissionEnum.DELETE_LABORATORIES,

    PermissionEnum.READ_RESERVATIONS,
    PermissionEnum.CREATE_RESERVATIONS,
    PermissionEnum.UPDATE_RESERVATIONS,
    PermissionEnum.DELETE_RESERVATIONS,
    PermissionEnum.MANAGE_RESERVATIONS_STATE,
  ],
  [RoleEnum.USER]: [
    PermissionEnum.READ_LABORATORIES,
    PermissionEnum.READ_RESERVATIONS,
    PermissionEnum.CREATE_RESERVATIONS,
  ],
};

export function hasPermissions(
  userRole: RoleEnum,
  requiredPermissions: PermissionEnum[],
): boolean {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
}

export function matchRoles(
  requiredRoles: RoleEnum[],
  userRole: RoleEnum,
): boolean {
  return requiredRoles.some((role) => userRole === role);
}
