import { Post } from '@base/api/models/Posts/Post';
import { EntityRepository, QueryBuilder } from 'typeorm';
import { RepositoryBase } from '@base/abstracts/RepositoryBase';

@EntityRepository(Post)
export class PostRepository extends RepositoryBase<Post> {
  public async createPost(data: object) {
    let entity = new Post();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async geUserPosts(userId: number) {
    const query = this.createQueryBuilder('posts');

    query.where('posts.user_id = :id', {id: userId})

    return query.getMany();
  }

  public async getNewsfeedPosts(followingIds: number[]) {
    const query = this.createQueryBuilder('posts');

    query.where('posts.user_id IN (:followingIds)', {followingIds: followingIds});
    query.orderBy('id', 'DESC');
    
    return query.getMany();
  }
}
