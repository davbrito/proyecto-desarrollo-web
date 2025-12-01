import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764552148692 implements MigrationInterface {
    name = 'Migration1764552148692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "reserve_type" (
                "id" SERIAL NOT NULL,
                "name" text NOT NULL,
                "minimalAnticipation" integer NOT NULL,
                "blockDuration" double precision NOT NULL,
                "priority" integer NOT NULL,
                "needApproval" boolean NOT NULL,
                CONSTRAINT "PK_3534a52fc83fde5288797f29d97" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "state" (
                "id" SERIAL NOT NULL,
                "name" text NOT NULL,
                CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reservation" (
                "id" SERIAL NOT NULL,
                "laboratoryId" integer NOT NULL,
                "typeId" integer NOT NULL,
                "userId" text NOT NULL,
                "stateId" integer NOT NULL,
                "name" text NOT NULL,
                "startDate" date NOT NULL,
                "endDate" date NOT NULL,
                "rrule" text,
                "defaultStartTime" TIME,
                "defaultEndTime" TIME,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "approvedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "occupation" (
                "id" SERIAL NOT NULL,
                "reservationId" integer NOT NULL,
                "date" date NOT NULL,
                "startHour" TIME NOT NULL,
                "endHour" TIME NOT NULL,
                "active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_07cfcefef555693d96dce8805c5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "event" (
                "id" SERIAL NOT NULL,
                "reservationId" integer NOT NULL,
                "estimatedAssistants" integer NOT NULL,
                CONSTRAINT "REL_5dfd12a0fe8e12c3e3e11d654e" UNIQUE ("reservationId"),
                CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "class" (
                "id" SERIAL NOT NULL,
                "reservationId" integer NOT NULL,
                "professor" text NOT NULL,
                CONSTRAINT "REL_1291ce79168ca671306522bc92" UNIQUE ("reservationId"),
                CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation"
            ADD CONSTRAINT "FK_72e39b274048a4e9c1ae50480a4" FOREIGN KEY ("laboratoryId") REFERENCES "laboratories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation"
            ADD CONSTRAINT "FK_8a49f5ec716289d21900a123592" FOREIGN KEY ("typeId") REFERENCES "reserve_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation"
            ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation"
            ADD CONSTRAINT "FK_e4c5ce84cc3fd00a5689e9d2d5e" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "occupation"
            ADD CONSTRAINT "FK_a72d48fd251a20e1ab92a51f020" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "event"
            ADD CONSTRAINT "FK_5dfd12a0fe8e12c3e3e11d654e6" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "class"
            ADD CONSTRAINT "FK_1291ce79168ca671306522bc920" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "class" DROP CONSTRAINT "FK_1291ce79168ca671306522bc920"
        `);
        await queryRunner.query(`
            ALTER TABLE "event" DROP CONSTRAINT "FK_5dfd12a0fe8e12c3e3e11d654e6"
        `);
        await queryRunner.query(`
            ALTER TABLE "occupation" DROP CONSTRAINT "FK_a72d48fd251a20e1ab92a51f020"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation" DROP CONSTRAINT "FK_e4c5ce84cc3fd00a5689e9d2d5e"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation" DROP CONSTRAINT "FK_529dceb01ef681127fef04d755d"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation" DROP CONSTRAINT "FK_8a49f5ec716289d21900a123592"
        `);
        await queryRunner.query(`
            ALTER TABLE "reservation" DROP CONSTRAINT "FK_72e39b274048a4e9c1ae50480a4"
        `);
        await queryRunner.query(`
            DROP TABLE "class"
        `);
        await queryRunner.query(`
            DROP TABLE "event"
        `);
        await queryRunner.query(`
            DROP TABLE "occupation"
        `);
        await queryRunner.query(`
            DROP TABLE "reservation"
        `);
        await queryRunner.query(`
            DROP TABLE "state"
        `);
        await queryRunner.query(`
            DROP TABLE "reserve_type"
        `);
    }

}
