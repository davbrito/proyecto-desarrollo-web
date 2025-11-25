import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { nanoid } from "nanoid";
import * as typeorm from "typeorm";

export enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}

export interface TokenPayload {
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

  @Exclude()
  @typeorm.Column("text", { nullable: false })
  password: string;

  @typeorm.Column("text")
  name: string;

  @typeorm.Column("text", {
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @typeorm.BeforeInsert()
  async hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJwtPayload(): TokenPayload {
    return {
      sub: this.id,
      username: this.username,
      role: this.role,
    };
  }
}
