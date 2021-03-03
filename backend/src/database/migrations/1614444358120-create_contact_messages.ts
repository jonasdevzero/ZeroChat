import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createContactMessages1614444358120 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "contact_messages",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isGenerated: true,
                    isUnique: true,
                    unsigned: true,
                    generationStrategy: "increment",
                },
                {
                    name: "id_contact",
                    type: "uuid",
                    unsigned: true,
                },
                {
                    name: "message",
                    type: "text",
                    unsigned: true,
                },
                {
                    name: "sender_id",
                    type: "uuid",
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
                    name: "ContactMessages",
                    columnNames: ["id_contact"],
                    referencedTableName: "contact",
                    referencedColumnNames: ["id"],
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
            ],
        }))
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("contact_messages");
    };

};
