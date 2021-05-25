import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/abstracts/EntityBase';

@Entity({ name: 'posts' })
export class Post extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  content: string;

  @Column()
  user_id: number;
}
