import { MigrationInterface, QueryRunner } from "typeorm";

export class Entities1764556878703 implements MigrationInterface {
    name = 'Entities1764556878703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_6358c15fd858c79a45514caa3ef"
        `);
        await queryRunner.query(`
            CREATE TABLE "states" (
                "id" SERIAL NOT NULL,
                "name" text NOT NULL,
                CONSTRAINT "UQ_fe52f02449eaf27be2b2cb7acda" UNIQUE ("name"),
                CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reserve_types" (
                "id" SERIAL NOT NULL,
                "name" text NOT NULL,
                "minimal_anticipation" integer NOT NULL DEFAULT '0',
                "block_duration" double precision NOT NULL DEFAULT '1',
                "priority" integer NOT NULL DEFAULT '0',
                "needs_approval" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_65c9b32e34ffb3927df4772c8aa" UNIQUE ("name"),
                CONSTRAINT "PK_714eba296981ac50f5f0b85beae" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ocupations" (
                "id" SERIAL NOT NULL,
                "date" date NOT NULL,
                "start_hour" TIME NOT NULL,
                "end_hour" TIME NOT NULL,
                "active" boolean NOT NULL DEFAULT true,
                "reservation_id" integer,
                CONSTRAINT "PK_e7695dfca0e9b2ac1f3e1ef25e7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_847ed658219add3973c0bf3f16" ON "ocupations" ("reservation_id", "date", "start_hour")
        `);
        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" SERIAL NOT NULL,
                "stimated_assistants" integer NOT NULL,
                "reservation_id" integer,
                CONSTRAINT "REL_533c4577ca9237da25428cd9a9" UNIQUE ("reservation_id"),
                CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "classes" (
                "id" SERIAL NOT NULL,
                "professor" text NOT NULL,
                "reservation_id" integer,
                CONSTRAINT "REL_6c80056680d2a9f6957c75c823" UNIQUE ("reservation_id"),
                CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reservations" (
                "id" SERIAL NOT NULL,
                "name" text NOT NULL,
                "start_date" date NOT NULL,
                "end_date" date,
                "rrule" text,
                "default_start_time" TIME NOT NULL,
                "default_end_time" TIME NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "approved_at" TIMESTAMP WITH TIME ZONE,
                "user_id" text,
                "laboratorie_id" integer,
                "type_id" integer,
                "state_id" integer,
                CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "refreshTokensId"
        `);
        await queryRunner.query(`
            ALTER TABLE "ocupations"
            ADD CONSTRAINT "FK_4b714458ce89c08974d00bee116" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "events"
            ADD CONSTRAINT "FK_533c4577ca9237da25428cd9a95" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "classes"
            ADD CONSTRAINT "FK_6c80056680d2a9f6957c75c823b" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "FK_4af5055a871c46d011345a255a6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "FK_fc4e01e9eec9fcac43dc104f34e" FOREIGN KEY ("laboratorie_id") REFERENCES "laboratories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "FK_2f0e42d37f153881a592857a72d" FOREIGN KEY ("type_id") REFERENCES "reserve_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "FK_ba79bd92f7c732753363ff5155f" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "FK_ba79bd92f7c732753363ff5155f"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "FK_2f0e42d37f153881a592857a72d"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "FK_fc4e01e9eec9fcac43dc104f34e"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "FK_4af5055a871c46d011345a255a6"
        `);
        await queryRunner.query(`
            ALTER TABLE "classes" DROP CONSTRAINT "FK_6c80056680d2a9f6957c75c823b"
        `);
        await queryRunner.query(`
            ALTER TABLE "events" DROP CONSTRAINT "FK_533c4577ca9237da25428cd9a95"
        `);
        await queryRunner.query(`
            ALTER TABLE "ocupations" DROP CONSTRAINT "FK_4b714458ce89c08974d00bee116"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "refreshTokensId" uuid
        `);
        await queryRunner.query(`
            DROP TABLE "reservations"
        `);
        await queryRunner.query(`
            DROP TABLE "classes"
        `);
        await queryRunner.query(`
            DROP TABLE "events"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_847ed658219add3973c0bf3f16"
        `);
        await queryRunner.query(`
            DROP TABLE "ocupations"
        `);
        await queryRunner.query(`
            DROP TABLE "reserve_types"
        `);
        await queryRunner.query(`
            DROP TABLE "states"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_6358c15fd858c79a45514caa3ef" FOREIGN KEY ("refreshTokensId") REFERENCES "refresh_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
