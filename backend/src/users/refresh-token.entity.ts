import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity.js";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { nullable: false })
  tokenHash: string;

  @Index()
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Index()
  @Column("timestamptz", { nullable: false })
  expiresAt: Date;

  @Index()
  @Column({ type: "boolean", default: false })
  isRevoked: boolean;
}
