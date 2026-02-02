import { IsInt, Min } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateEventDto {
  @IsInt()
  @Min(1)
  stimatedAssistants: number;

  @IsInt()
  reservationId: number;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
