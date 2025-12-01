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

  @Column("date", { nullable: false })
  date: Date;

  @Column("time", { nullable: false })
  startHour: string;

  @Column("time", { nullable: false })
  endHour: string;

  @Column("boolean", { default: true, nullable: false })
  active: boolean;
}
