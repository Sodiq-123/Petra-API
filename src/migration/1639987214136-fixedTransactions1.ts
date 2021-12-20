import {MigrationInterface, QueryRunner} from "typeorm";

export class fixedTransactions11639987214136 implements MigrationInterface {
    name = 'fixedTransactions11639987214136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "UQ_0b12a144bdc7678b6ddb0b913fc" UNIQUE ("reference")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_0b12a144bdc7678b6ddb0b913fc"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "type"`);
    }

}
