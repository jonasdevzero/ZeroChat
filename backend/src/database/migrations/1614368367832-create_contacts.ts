import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createContacts1614368367832 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "contacts",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                    unsigned: true,
                },
                {
                    name: "user_id",
                    type: "varchar",
                },
                {
                    name: "contact_id",
                    type: "varchar",
                },
                {
                    name: "contact_username",
                    type: "varchar",
                },
                {
                    name: "contact_image",
                    type: "text",
                    isNullable: true,
                }, 
                {
                    name: "last_message",
                    type: "text",
                },
                {
                    name: "last_message_time",
                    type: "timestamp with time zone"
                }
            ],
            foreignKeys: [
                {
                    name: "UserId",
                    columnNames: ["user_id"],
                    referencedTableName: "user",
                    referencedColumnNames: ["id"],
                }
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("contacts");
    };

};
