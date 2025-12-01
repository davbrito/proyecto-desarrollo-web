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

  @ManyToOne(() => Laboratory, { nullable: false })
  @JoinColumn()
  laboratory: Relation<Laboratory>;

  @Column("int", { nullable: false })
  laboratoryId: number;

  @ManyToOne(() => ReservationType, { nullable: false })
  @JoinColumn()
  type: Relation<ReservationType>;

  @Column("int", { nullable: false })
  typeId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: Relation<User>;

  @Column("text", { nullable: false })
  userId: string;

  @ManyToOne(() => State, { nullable: false })
  @JoinColumn()
  state: Relation<State>;

  @Column("int", { nullable: false })
  stateId: number;

  @Column("text", { nullable: false })
  name: string;

  @Column("date", { nullable: false })
  startDate: Date;

  @Column("date", { nullable: false })
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
