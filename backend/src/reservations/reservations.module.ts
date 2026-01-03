import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Reservation } from "./entities/reservation.entity.js";
import { State } from "./entities/state.entity.js";
import { ReserveType } from "./entities/reserve_type.entity.js";
import { Ocupation } from "./entities/ocupation.entity.js";
import { Class } from "./entities/class.entity.js";
import { Event } from "./entities/event.entity.js";

import { ReservationsController } from "./reservations.controller.js";
import { StatesController } from "./states.controller.js";

import { ReservationsService } from "./reservations.service.js";
import { StatesService } from "./services/states.service.js";

import { ReserveTypesService } from "./services/reserve-types.service.js";
import { ReserveTypesController } from "./reserve-types.controller.js";

import { OcupationsService } from "./services/ocupations.service.js";
import { OcupationsController } from "./ocupations.controller.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      State,
      ReserveType,
      Ocupation,
      Class,
      Event,
    ]),
  ],
  controllers: [
    ReservationsController,
    StatesController,
    ReserveTypesController,
    OcupationsController,
  ],
  providers: [
    ReservationsService,
    StatesService,
    ReserveTypesService,
    OcupationsService,
  ],
  exports: [
    ReservationsService,
    StatesService,
    ReserveTypesService,
    OcupationsService,
  ],
})
export class ReservationsModule {}
