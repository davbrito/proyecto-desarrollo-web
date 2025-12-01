import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "states" })
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", {
    unique: true,
    nullable: false,
  })
  name: string;
}
