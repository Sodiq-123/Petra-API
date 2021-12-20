import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWallets1639945684097 implements MigrationInterface {
    name = 'AddWallets1639945684097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "wallets" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wallets"`);
    }

}
