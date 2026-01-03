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
import { ReserveTypesService } from "./services/reserve-types.service.js";
import {
  CreateReserveTypeDto,
  UpdateReserveTypeDto,
} from "./dto/reserve-type.dto.js";

@Controller("reserve-types")
export class ReserveTypesController {
  constructor(private readonly service: ReserveTypesService) {}

  @Post()
  create(@Body() dto: CreateReserveTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateReserveTypeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
