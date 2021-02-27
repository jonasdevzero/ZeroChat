import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createGroupMessages1614391216337 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "group_messages",
            columns: [
                {
                    name: "group_id",
                    type: "varchar",
                },
                {
                    name: "message",
                    type: "text",
                },
                {
                    name: "posted_at",
                    type: "timestamp with time zone",
                    unsigned: true,
                },
            ],
            foreignKeys: [
                {
                    name: "GroupId",
                    columnNames: ["group_id"],
                    referencedTableName: "contacts",
                    referencedColumnNames: ["id"],
                },
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("group_messages");
    };

};
