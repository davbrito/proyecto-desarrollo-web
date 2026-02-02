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

import { ClassesService } from "./services/classes.service.js";
import { ClassesController } from "./classes.controller.js";

import { EventsService } from "./services/events.service.js";
import { EventsController } from "./events.controller.js";

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
    ClassesController,
    EventsController,
  ],
  providers: [
    ReservationsService,
    StatesService,
    ReserveTypesService,
    OcupationsService,
    ClassesService,
    EventsService,
  ],
  exports: [
    ReservationsService,
    StatesService,
    ReserveTypesService,
    OcupationsService,
    ClassesService,
    EventsService,
  ],
})
export class ReservationsModule {}
