import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createGroup1614445077509 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "group",
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
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "description",
                    type: "varchar",
                },
                {
                    name: "image",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "created_by",
                    type: "uuid",
                    unsigned: true,
                },
                {
                    name: "last_message_time",
                    type: "timestamp with time zone",
                    isNullable: true,
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
        await queryRunner.dropTable("group");
    };

};
