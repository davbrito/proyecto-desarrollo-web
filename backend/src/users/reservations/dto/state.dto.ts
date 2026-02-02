import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}

export class UpdateStateDto extends PartialType(CreateStateDto) {}
