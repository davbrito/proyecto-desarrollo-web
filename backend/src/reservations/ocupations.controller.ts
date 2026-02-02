import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { OcupationsService } from "./services/ocupations.service";
import { CreateOcupationDto, UpdateOcupationDto } from "./dto/ocupation.dto";
import { Auth } from "../auth/decorators/auth.decorator";

@Auth()
@Controller("ocupations")
export class OcupationsController {
  constructor(private readonly service: OcupationsService) {}

  @Post()
  create(@Body() dto: CreateOcupationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query("reservationId") reservationId?: number) {
    if (reservationId) {
      return this.service.findByReservation(Number(reservationId));
    }
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateOcupationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
