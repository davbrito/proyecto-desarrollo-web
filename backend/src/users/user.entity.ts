import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import type { SessionData } from "express-session";
import { nanoid } from "nanoid";
import * as typeorm from "typeorm";

export enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}

export interface UserJwtPayload {
  sub: string;
  username: string;
  role: RoleEnum;
}

@typeorm.Entity()
export class User {
  @typeorm.PrimaryColumn("text", { default: () => `'${nanoid()}'` })
  id: string;

  @typeorm.Column("text", { unique: true, nullable: false })
  username: string;

  @typeorm.Column("text", { unique: true, nullable: false })
  email: string;

  @typeorm.Column("text", { nullable: false })
  @Exclude()
  password: string;

  @typeorm.Column("text")
  name: string;

  @typeorm.Column("text", {
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @typeorm.OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @typeorm.BeforeInsert()
  async hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJwtPayload(): UserJwtPayload {
    return {
      sub: this.id,
      username: this.username,
      role: this.role,
    };
  }

  toDTO() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      name: this.name,
      role: this.role,
    };
  }
}

@typeorm.Entity()
export class Session {
  @typeorm.PrimaryColumn("text")
  id: string;

  @typeorm.Column("text")
  userId: string;

  @typeorm.Column({ type: "timestamptz", nullable: false })
  expiredAt: Date;

  @typeorm.CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @typeorm.DeleteDateColumn({ type: "timestamptz" })
  destroyedAt: Date | null;

  @typeorm.Column({ type: "json", nullable: false })
  data: SessionData;

  @typeorm.ManyToOne(() => User, (user) => user.sessions, {
    onDelete: "CASCADE",
  })
  user: User;
}
