import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { ILike, MoreThan, Repository } from "typeorm";
import { REFRESH_TOKEN_MAX_AGE } from "../auth/auth.constants.js";
import { SignUpDto } from "../auth/auth.dto.js";
import { RefreshToken } from "./refresh-token.entity.js";
import { RoleEnum, User } from "./user.entity.js";

@Injectable()
export class UsersService {
  private readonly MAX_ACTIVE_REFRESH_SESSIONS = 5;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  existsById(id: string): Promise<boolean> {
    return this.usersRepository.existsBy({ id });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username: ILike(username) });
  }

  async create(data: SignUpDto): Promise<User> {
    if (data.email) {
      const existsEmail = await this.usersRepository.existsBy({
        email: data.email,
      });

      if (existsEmail) {
        throw new ConflictException("El email ya está en uso");
      }
    }

    const existsUsername = await this.usersRepository.existsBy({
      username: ILike(data.username),
    });

    if (existsUsername) {
      throw new ConflictException("El nombre de usuario ya está en uso");
    }

    const user = this.usersRepository.create({
      username: data.username,
      email: data.email,
      password: data.password,
      name: data.name,
      role: RoleEnum.USER,
    });

    return this.usersRepository.save(user);
  }

  async createRefreshToken(userId: string, oldRefreshTokenId: string | null) {
    const refreshToken = randomBytes(32).toString("hex");
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE);

    const newTokenId = await this.createAndTrimSessions({
      userId,
      oldRefreshTokenId,
      expiresAt,
      tokenHash: hashedRefreshToken,
    });

    return `${newTokenId}.${refreshToken}`;
  }

  async validateRefreshToken(
    refreshToken: string | undefined,
  ): Promise<RefreshToken | null> {
    if (!refreshToken) return null;

    const [id, tokenValue] = refreshToken.split(".", 2);
    if (!id || !tokenValue) return null;

    const stored = await this.refreshTokensRepository.findOne({
      where: { id, expiresAt: MoreThan(new Date()), isRevoked: false },
      relations: ["user"],
    });
    if (!stored) return null;

    const isMatching = await bcrypt.compare(tokenValue, stored.tokenHash);
    if (!isMatching) return null;

    return stored;
  }

  async disposeRefreshToken(refreshToken: string) {
    const token = await this.validateRefreshToken(refreshToken);
    if (token) {
      await this.refreshTokensRepository.delete(token.id);
    }
  }

  private async createAndTrimSessions({
    userId,
    oldRefreshTokenId,
    expiresAt,
    tokenHash,
  }: {
    userId: string;
    oldRefreshTokenId: string | null;
    expiresAt: Date;
    tokenHash: string;
  }): Promise<string | null> {
    if (oldRefreshTokenId) {
      await this.refreshTokensRepository.delete(oldRefreshTokenId);
    }

    const tokensToDeleteQuery = this.refreshTokensRepository
      .createQueryBuilder("tokens")
      .select("tokens.id")
      .where("tokens.userId = :userId", { userId })
      .andWhere("NOT tokens.isRevoked")
      .andWhere("tokens.expiresAt > NOW()")
      .orderBy("tokens.createdAt", "DESC")
      .addOrderBy("tokens.id", "DESC")
      .offset(this.MAX_ACTIVE_REFRESH_SESSIONS);

    const deletedTokensQuery = this.refreshTokensRepository
      .createQueryBuilder()
      .delete()
      .where("id IN (select id from tokens_to_delete)");

    const query = this.refreshTokensRepository
      .createQueryBuilder("tokens")
      .addCommonTableExpression(tokensToDeleteQuery, "tokens_to_delete")
      .addCommonTableExpression(deletedTokensQuery, "deleted_tokens")
      .insert()
      .values({
        tokenHash,
        expiresAt,
        user: { id: userId },
      })
      .returning("id");

    const result = await query.execute();

    return result.raw[0]!.id! as string;
  }
}
