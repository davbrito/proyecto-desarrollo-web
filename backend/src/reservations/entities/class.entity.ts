import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Reservation } from "./reservation.entity.js";

@Entity({ name: "class" })
export class ClassReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Reservation)
  @JoinColumn()
  reservation: Relation<Reservation>;

  @Column("int")
  reservationId: number;

  @Column("text")
  professor: string;
}
