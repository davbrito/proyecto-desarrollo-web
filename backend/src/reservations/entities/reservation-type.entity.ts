import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Reservation } from "./reservation.entity.js";

@Entity({ name: "reserve_type" })
export class ReservationType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("int")
  minimalAnticipation: number;

  @Column("float")
  blockDuration: number;

  @Column("int")
  priority: number;

  @Column("boolean")
  needApproval: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.type)
  reservations: Relation<Reservation>[];
}
