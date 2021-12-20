import {MigrationInterface, QueryRunner} from "typeorm";

export class fixedTransactions1639964470600 implements MigrationInterface {
    name = 'fixedTransactions1639964470600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transactionId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount_to_send"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount_to_send" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount_to_send"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount_to_send" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transactionId"`);
    }

}
