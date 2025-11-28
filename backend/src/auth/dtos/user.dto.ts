import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "../auth.permissions.js";

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: String, nullable: true })
  email: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: RoleEnum })
  role: RoleEnum;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
