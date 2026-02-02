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
import { StatesService } from "./services/states.service";
import { CreateStateDto, UpdateStateDto } from "./dto/state.dto";
import { Auth } from "../auth/decorators/auth.decorator";

@Auth()
@Controller("states")
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Post()
  create(@Body() createStateDto: CreateStateDto) {
    return this.statesService.create(createStateDto);
  }

  @Get()
  findAll() {
    return this.statesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.statesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStateDto: UpdateStateDto,
  ) {
    return this.statesService.update(id, updateStateDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.statesService.remove(id);
  }
}
