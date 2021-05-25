import { Service } from 'typedi';
import { UserNotFoundException } from '@api/exceptions/Users/UserNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { RelationshipRepository } from '@base/api/repositories/Users/RelationshipRepository';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import fetch from 'node-fetch'
import { CannotFollowException } from '@base/api/exceptions/Users/CannotFollowException';
import { CannotBlockUserException } from '@base/api/exceptions/Users/CannotBlockUserException';
import { CannotRemoveUserException } from '@base/api/exceptions/Users/CannotRemoveUserException';

@Service()
export class RelationshipService {

  static FOLLOW_STATE = 1;
  static BLOCK_STATE = 2;

  constructor(
    @InjectRepository() private relationshipRepository: RelationshipRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async followUser(userToFollowId: number, loggedUser: LoggedUserInterface) {
	
    const userToFollow = await this.getUser(userToFollowId, loggedUser);

    let first_user_id = null;
    let second_user_id = null;
    
    if(loggedUser.userId <= userToFollowId) {
      first_user_id = loggedUser.userId;
      second_user_id = userToFollowId;
    } else {
      first_user_id = userToFollowId;
      second_user_id = loggedUser.userId;
    }
    
      const relation = await this.relationshipRepository.getRelationshipOfUsers(first_user_id, second_user_id, loggedUser.userId);
    
    if(relation) {
      throw new CannotFollowException();
    } 

    const relationshipData = {
      "first_user_id": first_user_id,
      "second_user_id": second_user_id,
      "action_user_id": loggedUser.userId,
      "state": RelationshipService.FOLLOW_STATE
    }

    return this.relationshipRepository.createRelationship(relationshipData);

  }

  public async blockUser(userToBlockId: number, loggedUser: LoggedUserInterface) {
	
    const userToBlock = await this.getUser(userToBlockId, loggedUser);

    let first_user_id = null;
    let second_user_id = null;
    
    if(loggedUser.userId <= userToBlockId) {
      first_user_id = loggedUser.userId;
      second_user_id = userToBlockId;
    } else {
      first_user_id = userToBlockId;
      second_user_id = loggedUser.userId;
    }

    const relationship = await this.relationshipRepository.getRelationshipOfUsers(first_user_id, second_user_id, loggedUser.userId);

    if(relationship) {
      if(relationship.state == RelationshipService.BLOCK_STATE) {
        throw new CannotBlockUserException();
      }
    }

    if(relationship) {

      const relationshipData = {
        "first_user_id": first_user_id,
        "second_user_id": second_user_id,
        "action_user_id": loggedUser.userId,
        "state": RelationshipService.BLOCK_STATE
      }

      return this.relationshipRepository.updateRelationship(relationship, relationshipData);
    } else {
      const relationshipData = {
        "first_user_id": first_user_id,
        "second_user_id": second_user_id,
        "action_user_id": loggedUser.userId,
        "state": RelationshipService.BLOCK_STATE
      }
  
      return this.relationshipRepository.createRelationship(relationshipData);
    }

  }

  public async removeUser(userToRemoveId: number, loggedUser: LoggedUserInterface) {
	
    const userToRemove = await this.getUser(userToRemoveId, loggedUser);

    let first_user_id = null;
    let second_user_id = null;
    
    if(loggedUser.userId <= userToRemoveId) {
      first_user_id = loggedUser.userId;
      second_user_id = userToRemoveId;
    } else {
      first_user_id = userToRemoveId;
      second_user_id = loggedUser.userId;
    }
    
      const relationship = await this.relationshipRepository.getRelationshipOfUsers(first_user_id, second_user_id, loggedUser.userId);
    
    if(!relationship) {
      throw new CannotRemoveUserException();
    } 

    if(relationship.state == RelationshipService.BLOCK_STATE) {
      throw new CannotRemoveUserException();
    }

    return await this.relationshipRepository.deleteRelationship(relationship);
  }

  private async getUser(id: number, loggedUser: LoggedUserInterface) {

    const getUserRequest = await fetch('http://localhost:3000/users/' + id, {
      headers: {"Authorization": loggedUser.authHeader}
    })

    if(!getUserRequest.ok) {
      throw new UserNotFoundException();
    }

    const user  = await getUserRequest.json();

    return user;
  }

  public async getFollowingUserIdsOf(userId: number) {
    var followingUsers = await this.relationshipRepository.getFollowingUserIdsOf(userId);

    var followingUsersIds: any = followingUsers.map(o => Object.values(o));


    followingUsersIds = followingUsersIds.reduce((acc: any, val: any) => acc.concat(val), []); // Flat the array like ( array.flat());

    followingUsersIds = followingUsersIds.filter( (x: any) =>  x != userId);

    return followingUsersIds;
  }
}

