import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Reservation } from "../../reservations/entities/reservation.entity.js";

@Entity({ name: "laboratories" })
export class Laboratory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("int")
  number: number;

  @Column("boolean", { default: true })
  active: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.laboratory)
  reservations: Relation<Reservation>[];
}
