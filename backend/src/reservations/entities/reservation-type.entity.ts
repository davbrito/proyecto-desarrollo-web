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

  @Column("text", { nullable: false })
  name: string;

  @Column("int", { nullable: false })
  minimalAnticipation: number;

  @Column("float", { nullable: false })
  blockDuration: number;

  @Column("int", { nullable: false })
  priority: number;

  @Column("boolean", { nullable: false })
  needApproval: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.type)
  reservations: Relation<Reservation>[];
}
