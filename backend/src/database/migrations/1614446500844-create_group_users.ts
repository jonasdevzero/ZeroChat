import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createGroupUsers1614446500844 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: "group_users",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isGenerated: true,
                    isUnique: true,
                    unsigned: false,
                    generationStrategy: "increment",
                },
                {
                    name: "group_id",
                    type: "uuid",
                },
                {
                    name: "user_id",
                    type: "uuid",
                },
                {
                    name: "role",
                    type: "varchar",
                },
            ],
            foreignKeys: [
                {
                    name: "GroupUsers",
                    columnNames: ["group_id"],
                    referencedTableName: "group",
                    referencedColumnNames: ["id"],
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                {
                    name: "UserGroup",
                    columnNames: ["user_id"],
                    referencedTableName: "user",
                    referencedColumnNames: ["id"],
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("group_users");
    };

};
