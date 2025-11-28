import * as crypto from "node:crypto";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { User } from "./user.entity.js";

@Entity()
@Index(["user", "createdAt"])
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { nullable: false })
  tokenHash: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  user: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;

  @Column("timestamptz", { nullable: false })
  expiresAt: Date;

  @Column({ type: "boolean", default: false })
  isRevoked: boolean;

  validateHash(token: string) {
    return validateRefreshToken(token, this.tokenHash);
  }
}

function hashRefreshToken(token: string) {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return hash;
}

function validateRefreshToken(token: string, expectedHash: string): boolean {
  const hash = hashRefreshToken(token);
  const hashBuffer = Buffer.from(hash);
  const tokenHashBuffer = Buffer.from(expectedHash);

  if (hashBuffer.length !== tokenHashBuffer.length) return false;

  return crypto.timingSafeEqual(hashBuffer, tokenHashBuffer);
}

export function createHashedRefreshToken() {
  const algorithm = "sha256";
  const token = crypto.randomBytes(32).toString("hex");
  const hash = hashRefreshToken(token);
  return { token, hash, algorithm };
}
