import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'relationships' })
export class Relationship extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  first_user_id: number;

  @Column()
  second_user_id: number;

  @Column()
  action_user_id: number;

  @Column()
  state: number;
}
