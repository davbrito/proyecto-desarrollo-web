import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionData, SessionOptions, Store } from "express-session";
import { ms } from "ms";
import { escapeLiteral } from "pg";
import { IsNull, Repository } from "typeorm";
import { Session } from "../users/user.entity.js";
import { SessionUserPayload } from "./session.serializer.js";

declare module "express-session" {
  interface SessionData {
    id: string;
    passport: {
      user: SessionUserPayload;
    };
  }
}

/** One day in seconds. */
const oneDay = ms("1d") / 1000;

export type Ttl =
  | number
  | ((store: SessionStore, sess: SessionData, sid?: string) => number);

export type SessionStoreOptions = Partial<
  SessionOptions & {
    cleanupLimit: number;
    limitSubquery: boolean;
    onError: (s: SessionStore, e: Error) => void;
    ttl: Ttl;
  }
>;

export class SessionStore extends Store {
  private cleanupLimit: number | undefined;
  private limitSubquery = true;
  private onError: ((s: SessionStore, e: Error) => void) | undefined;
  private ttl: Ttl | undefined;

  /** Initializes SessionStore with the given `options`. */
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
    @Inject("SessionStoreOptions")
    options: SessionStoreOptions = {},
  ) {
    super();
    this.cleanupLimit = options.cleanupLimit;
    if (options.limitSubquery !== undefined) {
      this.limitSubquery = options.limitSubquery;
    }
    this.onError = options.onError;
    this.ttl = options.ttl;
  }

  /** Attempts to fetch session by the given `sid`. */
  public get = (
    sid: string,
    fn: (error?: Error | undefined, result?: SessionData) => void,
  ) => {
    this.createQueryBuilder()
      .andWhere("session.id = :id", { id: sid })
      .getOne()
      .then((session) => {
        if (!session) {
          return fn();
        }

        const result = session.data;

        fn(undefined, result);
      })
      .catch((er: Error) => {
        fn(er);
        this.handleError(er);
      });
  };

  /** Commits the given `sess` object associated with the given `sid`. */
  public set = (
    sid: string,
    sess: SessionData,
    fn?: (error?: Error) => void,
  ) => {
    const args = [sid];
    let json: SessionData;

    try {
      json = sess;
    } catch (er: unknown) {
      if (er instanceof Error) {
        return fn ? fn(er) : undefined;
      } else {
        return fn ? fn(new Error("serialize error")) : undefined;
      }
    }

    args.push(JSON.stringify(json));

    const ttl = this.getTTL(sess, sid);
    args.push("EX", ttl.toString());

    (this.cleanupLimit
      ? (() => {
          const $ = this.repository
            .createQueryBuilder("session")
            .withDeleted()
            .select("session.id")
            .where(`session.expiredAt <= NOW()`)
            .limit(this.cleanupLimit);
          return this.limitSubquery
            ? Promise.resolve($.getQuery())
            : $.getMany().then((xs) =>
                xs.length
                  ? xs
                      .map((x) =>
                        typeof x.id === "string"
                          ? escapeLiteral(x.id)
                          : `${x.id}`,
                      )
                      .join(", ")
                  : "NULL",
              );
        })().then((ids) =>
          this.repository
            .createQueryBuilder()
            .delete()
            .where(`id IN (${ids})`)
            .execute(),
        )
      : Promise.resolve()
    )
      .then(async () => {
        try {
          // If a session with the given SID is already present (even deleted), renew it.
          // Else, create a new row/session.
          await this.repository.findOneOrFail({
            where: { id: sid },
            withDeleted: true,
          });
          await this.repository.update(
            {
              destroyedAt: IsNull(),
              id: sid,
            },
            {
              expiredAt: new Date(Date.now() + ttl * 1000),
              data: json,
            },
          );
        } catch (_) {
          await this.repository.insert({
            userId: json.passport.user.id,
            expiredAt: new Date(Date.now() + ttl * 1000),
            id: sid,
            data: json,
          });
        }
      })
      .then(() => {
        if (fn) {
          fn();
        }
      })
      .catch((er) => {
        if (fn) {
          fn(er);
        }

        this.handleError(er);
      });
  };

  /** Destroys the session associated with the given `sid`. */
  public destroy = (sid: string | string[], fn?: (error?: Error) => void) => {
    Promise.all(
      (Array.isArray(sid) ? sid : [sid]).map((x) => {
        this.repository.softDelete({ id: x });
      }),
    )
      .then(() => {
        if (fn) {
          fn();
        }
      })
      .catch((er) => {
        if (fn) {
          fn(er);
        }

        this.handleError(er);
      });
  };

  /** Refreshes the time-to-live for the session with the given `sid`. */
  public touch = (
    sid: string,
    sess: SessionData,
    fn?: (error?: Error) => void,
  ) => {
    const ttl = this.getTTL(sess);

    if (sess?.cookie?.expires) {
      if (fn) {
        fn();
      }
    }

    this.repository
      .update(sid, { expiredAt: new Date(Date.now() + ttl * 1000) })
      .then(() => {
        if (fn) {
          fn();
        }
      })
      .catch((er) => {
        if (fn) {
          fn(er);
        }

        this.handleError(er);
      });
  };

  /** Fetches all sessions. */
  public all = (
    fn: (error: Error | undefined, result: SessionData[]) => void,
  ) => {
    let result: SessionData[] = [];

    this.createQueryBuilder()
      .getMany()
      .then((sessions) => {
        result = sessions.map((session) => {
          const sess = session.data;
          sess.id = session.id;
          return sess;
        });

        fn(undefined, result);
      })
      .catch((er) => {
        fn(er, result);
        this.handleError(er);
      });
  };

  private createQueryBuilder() {
    return this.repository
      .createQueryBuilder("session")
      .where("session.expiredAt > NOW()");
  }

  private getTTL(sess: SessionData, sid?: string) {
    if (typeof this.ttl === "number") {
      return this.ttl;
    }
    if (typeof this.ttl === "function") {
      return this.ttl(this, sess, sid);
    }

    const maxAge = sess.cookie.maxAge;
    return typeof maxAge === "number" ? Math.floor(maxAge / 1000) : oneDay;
  }

  private handleError(er: Error) {
    if (this.onError) {
      this.onError(this, er);
    } else {
      this.emit("disconnect", er);
    }
  }
}
