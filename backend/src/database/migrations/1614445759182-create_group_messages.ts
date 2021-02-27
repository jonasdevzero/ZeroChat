import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createGroupMessages1614445759182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "group_messages",
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
                    unsigned: true,
                },
                {
                    name: "sender_id",
                    type: "uuid",
                    unsigned: true,
                },
                {
                    name: "message",
                    type: "text",
                    unsigned: true,
                },
                {
                    name: "posted_at",
                    type: "timestamp with time zone",
                    unsigned: true,
                },
            ],
            foreignKeys: [
                {
                    name: "GroupMessages",
                    columnNames: ["group_id"],
                    referencedTableName: "group",
                    referencedColumnNames: ["id"],
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("group_messages");
    };

};
