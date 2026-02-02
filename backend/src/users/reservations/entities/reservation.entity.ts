import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import type { Relation } from "typeorm";
import { User } from "../../users/entities/user.entity.js";
import { Laboratory } from "../../laboratories/entities/laboratory.entity.js";
import { ReserveType } from "./reserve_type.entity.js";
import { State } from "./state.entity.js";
import { Ocupation } from "./ocupation.entity.js";
import { Class } from "./class.entity.js";
import { Event } from "./event.entity.js";

@Entity({ name: "reservations" })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("date", { name: "start_date" })
  startDate: Date;

  @Column("date", { name: "end_date", nullable: true })
  endDate?: Date;
  @Column("text", { nullable: true })
  rrule?: string;

  @Column("time", { name: "default_start_time" })
  defaultStartTime: string;

  @Column("time", { name: "default_end_time" })
  defaultEndTime: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "approved_at", nullable: true })
  approvedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: Relation<User>;

  @ManyToOne(() => Laboratory)
  @JoinColumn({ name: "laboratorie_id" })
  laboratory: Relation<Laboratory>;

  @ManyToOne(() => ReserveType)
  @JoinColumn({ name: "type_id" })
  type: Relation<ReserveType>;

  @ManyToOne(() => State)
  @JoinColumn({ name: "state_id" })
  state: Relation<State>;

  @OneToMany(() => Ocupation, (ocupation) => ocupation.reservation)
  ocupations: Relation<Ocupation[]>;

  @OneToOne(() => Class, (classInstance) => classInstance.reservation)
  classInstance?: Relation<Class>;

  @OneToOne(() => Event, (event) => event.reservation)
  event?: Relation<Event>;
}
