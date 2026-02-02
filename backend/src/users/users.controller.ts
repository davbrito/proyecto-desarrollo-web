import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { RegisterDto } from "../auth/dtos/register.dto";
import { UsersService } from "./services/users.service";
import { ChangeUserRoleDto } from "./dto/change-user-role.dto";
import { PermissionEnum } from "../auth/auth.permissions";

@Auth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }

  // Separate endpoint to change role for safety
  @RequirePermissions(PermissionEnum.UPDATE_USERS)
  @Patch(":id/role")
  async changeRole(@Param("id") id: string, @Body() dto: ChangeUserRoleDto) {
    return await this.usersService.changeRole(id, dto.role);
  }

  @RequirePermissions(PermissionEnum.READ_USERS)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  @Get("username/:username")
  async findByUsername(@Param("username") username: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(`Usuario @${username} no encontrado`);
    }
    return user;
  }
}
