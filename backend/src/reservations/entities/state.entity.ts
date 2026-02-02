import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "states" })
export class State {
  @PrimaryColumn({ type: "int" })
  id: number;

  @Column("text", {
    unique: true,
    nullable: false,
  })
  name: string;
}
