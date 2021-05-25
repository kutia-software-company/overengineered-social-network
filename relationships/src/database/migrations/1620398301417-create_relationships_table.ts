import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createRelationshipsTable1620398301417 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'relationships',
            columns: [
              { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
              { name: 'first_user_id', type: 'bigint' },
              { name: 'second_user_id', type: 'bigint' },
              { name: 'action_user_id', type: 'bigint' },
              { name: 'state', type: 'int' }
            ],
          });
      
          await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}