import { MigrationInterface, QueryRunner } from "typeorm";

export class Ids1769994736501 implements MigrationInterface {
    name = 'Ids1769994736501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "FK_ba79bd92f7c732753363ff5155f"
        `);
        await queryRunner.query(`
            ALTER TABLE "states"
            ALTER COLUMN "id" DROP DEFAULT
        `);
        await queryRunner.query(`
            DROP SEQUENCE "states_id_seq"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "FK_2f0e42d37f153881a592857a72d"
        `);
        await queryRunner.query(`
            ALTER TABLE "reserve_types"
            ALTER COLUMN "id" DROP DEFAULT
        `);
        await queryRunner.query(`
            DROP SEQUENCE "reserve_types_id_seq"
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
            CREATE SEQUENCE IF NOT EXISTS "reserve_types_id_seq" OWNED BY "reserve_types"."id"
        `);
        await queryRunner.query(`
            ALTER TABLE "reserve_types"
            ALTER COLUMN "id"
            SET DEFAULT nextval('"reserve_types_id_seq"')
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "FK_2f0e42d37f153881a592857a72d" FOREIGN KEY ("type_id") REFERENCES "reserve_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS "states_id_seq" OWNED BY "states"."id"
        `);
        await queryRunner.query(`
            ALTER TABLE "states"
            ALTER COLUMN "id"
            SET DEFAULT nextval('"states_id_seq"')
        `);
        await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "FK_ba79bd92f7c732753363ff5155f" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
