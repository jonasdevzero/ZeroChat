import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createContact1614443152498 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "contact",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isUnique: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                    default: `uuid_generate_v4()`,
                },
                {
                    name: "user_id",
                    type: "uuid",
                },
                {
                    name: "contact_id",
                    type: "uuid",
                },
                {
                    name: "unread_messages",
                    type: "integer",
                    isNullable: true,
                },
                {
                    name: "last_message_time",
                    type: "timestamp with time zone",
                    isNullable: true,
                },
                {
                    name: "active",
                    type: "boolean",
                },
                {
                    name: "blocked",
                    type: "boolean",
                },
            ],
            foreignKeys: [
                {
                    name: "ContactUser",
                    columnNames: ["user_id"],
                    referencedTableName: "user",
                    referencedColumnNames: ["id"],
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                {
                    name: "ContactContact",
                    columnNames: ["contact_id"],
                    referencedTableName: "user",
                    referencedColumnNames: ["id"],
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("contact");
    };

};
