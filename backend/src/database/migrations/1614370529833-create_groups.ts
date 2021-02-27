import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createGroups1614370529833 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "groups",
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
                    name: "image",
                    type: "text",
                },
                {
                    name: "description",
                    type: "varchar",
                },
                {
                    name: "created_by",
                    type: "varchar",
                },
                {
                    name: "last_message",
                    type: "text",
                },
                {
                    name: "last_message_sender",
                    type: "varchar",
                },
                {
                    name: "last_message_time",
                    type: "timestamp with time zone",
                },
                {
                    name: "created_at",
                    type: "timestamp with time zone",
                    unsigned: true,
                },
                {
                    name: "updated_at",
                    type: "timestamp with time zone",
                },                
            ],
        }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("groups");
    };

};
