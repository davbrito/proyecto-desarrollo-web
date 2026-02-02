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
import { ClassesService } from "./services/classes.service";
import { CreateClassDto, UpdateClassDto } from "./dto/class.dto";
import { Auth } from "../auth/decorators/auth.decorator";

@Auth()
@Controller("classes")
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
