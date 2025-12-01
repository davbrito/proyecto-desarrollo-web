import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Reservation } from "./reservation.entity.js";

@Entity({ name: "occupation" })
export class Occupation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation)
  @JoinColumn()
  reservation: Relation<Reservation>;

  @Column("int")
  reservationId: number;

  @Column("date")
  date: Date;

  @Column("time")
  startHour: string;

  @Column("time")
  endHour: string;

  @Column("boolean", { default: true })
  active: boolean;
}
