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

  @Column("text", { nullable: false })
  name: string;

  @Column("int", { nullable: false })
  number: number;

  @Column("boolean", { default: true, nullable: false })
  active: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.laboratory)
  reservations: Relation<Reservation>[];
}
