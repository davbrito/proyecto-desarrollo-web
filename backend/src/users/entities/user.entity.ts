import * as argon2 from "argon2";
import { Exclude } from "class-transformer";
import { nanoid } from "nanoid";
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { RoleEnum } from "../../auth/auth.permissions.js";
import type { TokenPayload } from "../../auth/token-payload.interface.js";
import { Reservation } from "../../reservations/entities/reservation.entity.js";
import { RefreshToken } from "./refresh-token.entity.js";

@Entity()
export class User {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column("text", { unique: true, nullable: false })
  username: string;

  @Column("text", { unique: true, nullable: true })
  email: string | null;

  @Exclude()
  @Column("text", { nullable: false })
  password: string;

  @Column("text")
  name: string;

  @Column("text", {
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @ManyToOne(() => RefreshToken, (token) => token.user)
  refreshTokens: Relation<RefreshToken>[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Relation<Reservation>[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  toJwtPayload(): TokenPayload {
    return {
      sub: this.id,
      username: this.username,
      role: this.role,
    };
  }

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = nanoid();
    }
  }
}
