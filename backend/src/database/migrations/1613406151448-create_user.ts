import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUser1613406151448 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isGenerated: true,
                    isPrimary: true,
                    unsigned: true,
                    generationStrategy: "increment",
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
                    default: "https://github.com/jonasdevzero/MediaHub/blob/master/images/profilePicture.png?raw=true",
                },
                {
                    name: "resetToken",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "expiresToken",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "socketId",
                    type: "varchar",
                    isNullable: true,
                },
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
    };

};
