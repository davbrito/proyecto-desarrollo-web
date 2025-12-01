import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Reservation } from "./reservation.entity.js";

@Entity({ name: "state" })
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @OneToMany(() => Reservation, (reservation) => reservation.state)
  reservations: Relation<Reservation>[];
}
