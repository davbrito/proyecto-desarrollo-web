import { User } from "../../users/entities/user.entity";
import { UserDto } from "../dtos/user.dto";

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
