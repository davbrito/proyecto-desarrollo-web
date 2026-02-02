import {
  IsDateString,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Matches,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateOcupationDto {
  @IsDateString()
  date: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/, {
    message: "startHour debe estar en formato HH:mm:ss",
  })
  startHour: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/, {
    message: "endHour debe estar en formato HH:mm:ss",
  })
  endHour: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsInt()
  reservationId: number;
}

export class UpdateOcupationDto extends PartialType(CreateOcupationDto) {}
