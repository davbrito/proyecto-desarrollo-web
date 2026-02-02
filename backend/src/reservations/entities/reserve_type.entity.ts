import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "reserve_types" })
export class ReserveType {
  @PrimaryColumn({ type: "int" })
  id: number;

  @Column("text", {
    unique: true,
    nullable: false,
  })
  name: string;

  @Column("int", {
    name: "minimal_anticipation",
    nullable: false,
    default: 0,
  })
  minimalAnticipation: number;

  @Column("float", {
    name: "block_duration",
    nullable: false,
    default: 1,
  })
  blockDuration: number;

  @Column("int", {
    nullable: false,
    default: 0,
  })
  priority: number;

  @Column("boolean", {
    name: "needs_approval",
    nullable: false,
    default: false,
  })
  needsApproval: boolean;
}
