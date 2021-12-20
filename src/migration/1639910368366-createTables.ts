import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1639910368366 implements MigrationInterface {
    name = 'createTables1639910368366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "customer_reference"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "customer_reference" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "customer_reference"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "customer_reference" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(20) NOT NULL`);
    }

}
