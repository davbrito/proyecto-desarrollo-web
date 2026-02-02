import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  Matches,
  IsNotEmpty,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  rrule?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/)
  defaultStartTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)$/)
  defaultEndTime: string;

  @IsInt()
  laboratoryId: number;

  @IsInt()
  typeId: number;

  @IsInt()
  stateId: number;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
