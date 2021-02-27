import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createGroupUsers1614391225127 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "group_users",
            columns: [
                {
                    name: "group_id",
                    type: "varchar",
                },
                {
                    name: "user_id",
                    type: "varchar",
                }, 
                {
                    name: "user_image",
                    type: "text",
                },
                {
                    name: "user_username",
                    type: "varchar",
                },
            ],
            foreignKeys: [
                {
                    name: "GroupId",
                    columnNames: ["group_id"],
                    referencedTableName: "groups",
                    referencedColumnNames: ["id"],
                },
                {
                    name: "UserId",
                    columnNames: ["user_id"],
                    referencedTableName: "user",
                    referencedColumnNames: ["id"],
                },
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("group_users");
    };

};
