import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { LaboratoriesService } from "./laboratories.service";
import { CreateLaboratoryDto, UpdateLaboratoryDto } from "./laboratory.dto";
import { Auth } from "../auth/decorators/auth.decorator";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { PermissionEnum } from "../auth/auth.permissions";

@Auth()
@Controller("laboratories")
export class LaboratoriesController {
  constructor(private readonly laboratoriesService: LaboratoriesService) {}

  @RequirePermissions(PermissionEnum.CREATE_LABORATORIES)
  @Post()
  create(@Body() createLaboratoryDto: CreateLaboratoryDto) {
    return this.laboratoriesService.create(createLaboratoryDto);
  }

  @RequirePermissions(PermissionEnum.READ_LABORATORIES)
  @Get()
  findAll() {
    return this.laboratoriesService.findAll();
  }

  @RequirePermissions(PermissionEnum.READ_LABORATORIES)
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.laboratoriesService.findOne(id);
  }

  @RequirePermissions(PermissionEnum.UPDATE_LABORATORIES)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateLaboratoryDto: UpdateLaboratoryDto,
  ) {
    return this.laboratoriesService.update(id, updateLaboratoryDto);
  }

  @RequirePermissions(PermissionEnum.DELETE_LABORATORIES)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.laboratoriesService.remove(id);
  }
}
