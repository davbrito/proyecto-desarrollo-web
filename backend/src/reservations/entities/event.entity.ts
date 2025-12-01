import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Reservation } from "./reservation.entity.js";

@Entity({ name: "event" })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Reservation, { nullable: false })
  @JoinColumn()
  reservation: Relation<Reservation>;

  @Column("int", { nullable: false })
  reservationId: number;

  @Column("int", { nullable: false })
  estimatedAssistants: number;
}
