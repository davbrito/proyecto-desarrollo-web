import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Reservation } from "./entities/reservation.entity";
import { State } from "./entities/state.entity";
import { ReserveType } from "./entities/reserve_type.entity";
import { Ocupation } from "./entities/ocupation.entity";
import { Class } from "./entities/class.entity";
import { Event } from "./entities/event.entity";

import { ReservationsController } from "./reservations.controller";
import { StatesController } from "./states.controller";

import { ReservationsService } from "./reservations.service";
import { StatesService } from "./services/states.service";

import { ReserveTypesService } from "./services/reserve-types.service";
import { ReserveTypesController } from "./reserve-types.controller";

import { OcupationsService } from "./services/ocupations.service";
import { OcupationsController } from "./ocupations.controller";

import { ClassesService } from "./services/classes.service";
import { ClassesController } from "./classes.controller";

import { EventsService } from "./services/events.service";
import { EventsController } from "./events.controller";

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
