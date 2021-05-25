import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';
import { Relationship } from '@base/api/models/Relationship/Relationship';

@EntityRepository(Relationship)
export class RelationshipRepository extends RepositoryBase<Relationship> {

  static FOLLOW_STATE = 1;
  static BLOCK_STATE = 2;

  public async createRelationship(data: object) {
    let entity = new Relationship();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateRelationship(relationship: Relationship, data: object) {
    Object.assign(relationship, data);

    return await relationship.save(data);
  }

  public async getRelationshipOfUsers(firstUserId: number, secondUserId: number, actionUserId: number) {
    const query = this.createQueryBuilder('relationships');

    query.where('relationships.first_user_id = :firstUserId', {firstUserId: firstUserId});
    query.andWhere('relationships.second_user_id = :secondUserId', {secondUserId: secondUserId});
    query.andWhere('relationships.action_user_id = :actionUserId', {actionUserId: actionUserId});

    return await query.getOne();
  }

  public async deleteRelationship(relationship: Relationship) {
    const query = this.createQueryBuilder('relationships');

    query.where('relationships.id = :id', {id: relationship.id});

    return await query.delete().execute();
  }

  public async getFollowingUserIdsOf(userId: number) {
    const query = this.createQueryBuilder('relationships');

    query.where('relationships.action_user_id = :userId', {userId: userId});
    query.andWhere('relationships.state = :state', {state: RelationshipRepository.FOLLOW_STATE});

    query.select('relationships.first_user_id');
    query.addSelect('relationships.second_user_id');
    
    return await query.getMany();
  }

}
