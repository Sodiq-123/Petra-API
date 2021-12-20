import {MigrationInterface, QueryRunner} from "typeorm";

export class fixedTransactions1639956386603 implements MigrationInterface {
    name = 'fixedTransactions1639956386603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "wallet_type"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount_to_send" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "deposit_address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "currency_to_send" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "customer_reference" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "customer_reference"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "currency_to_send"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "deposit_address"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount_to_send"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fee"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "wallet_type" character varying NOT NULL`);
    }

}
