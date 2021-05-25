import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePostsTable1619785965685 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'posts',
            columns: [
              { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
              { name: 'content', type: 'varchar', length: '191' },
              { name: 'user_id', type: 'bigint' },
            ],
          });
      
          await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
