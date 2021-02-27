import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createContactMessages1614390544749 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "contact_messages",
            columns: [
                {
                    name: "contact_id",
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
                    name: "ContactId",
                    columnNames: ["contact_id"],
                    referencedTableName: "contacts",
                    referencedColumnNames: ["id"],
                },
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("contact_messages");
    };

};
