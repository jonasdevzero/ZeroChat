import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUser1613406151448 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    unsigned: true,
                    isUnique: true,
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "username",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "password",
                    type: "varchar",
                },
                {
                    name: "picture",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "resetToken",
                    type: "varchar",
                    isNullable: true,
                    isUnique: true,
                },
                {
                    name: "expireToken",
                    type: "timestamp with time zone",
                    isNullable: true,
                },
                {
                    name: "created_at",
                    type: "timestamp with time zone",
                },
                {
                    name: "updated_at",
                    type: "timestamp with time zone",
                },
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
    };

};
