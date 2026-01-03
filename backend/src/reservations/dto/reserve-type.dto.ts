import {
  IsString,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateReserveTypeDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minimalAnticipation?: number;

  @IsNumber()
  @Min(0.5)
  @IsOptional()
  blockDuration?: number;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  needsApproval?: boolean;
}

export class UpdateReserveTypeDto extends PartialType(CreateReserveTypeDto) {}
