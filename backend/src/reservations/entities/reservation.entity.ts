import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Laboratory } from "../../laboratories/entities/laboratory.entity.js";
import { User } from "../../users/entities/user.entity.js";
import { ReservationType } from "./reservation-type.entity.js";
import { State } from "./state.entity.js";

@Entity({ name: "reservation" })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Laboratory)
  @JoinColumn()
  laboratory: Relation<Laboratory>;

  @Column("int")
  laboratoryId: number;

  @ManyToOne(() => ReservationType)
  @JoinColumn()
  type: Relation<ReservationType>;

  @Column("int")
  typeId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: Relation<User>;

  @Column("text")
  userId: string;

  @ManyToOne(() => State)
  @JoinColumn()
  state: Relation<State>;

  @Column("int")
  stateId: number;

  @Column("text")
  name: string;

  @Column("date")
  startDate: Date;

  @Column("date")
  endDate: Date;

  @Column("text", { nullable: true })
  rrule: string;

  @Column("time", { nullable: true })
  defaultStartTime: string;

  @Column("time", { nullable: true })
  defaultEndTime: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @Column("timestamptz", { nullable: true })
  approvedAt: Date;
}
