import { IsString, IsInt, MinLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateClassDto {
  @IsString()
  @MinLength(3)
  professor: string;

  @IsInt()
  reservationId: number;
}

export class UpdateClassDto extends PartialType(CreateClassDto) {}
