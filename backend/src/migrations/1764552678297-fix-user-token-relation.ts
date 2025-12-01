import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserTokenRelation1764552678297 implements MigrationInterface {
    name = 'FixUserTokenRelation1764552678297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_6358c15fd858c79a45514caa3ef"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "refreshTokensId"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "refreshTokensId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_6358c15fd858c79a45514caa3ef" FOREIGN KEY ("refreshTokensId") REFERENCES "refresh_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
