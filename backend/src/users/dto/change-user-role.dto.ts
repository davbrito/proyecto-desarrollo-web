import { IsEnum } from "class-validator";
import { RoleEnum } from "@uneg-lab/api-types/auth";

export class ChangeUserRoleDto {
  @IsEnum(RoleEnum)
  role!: RoleEnum;
}
