import {
  Get,
  JsonController,
  UseBefore,
  Param,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { RelationshipService } from '@base/api/services/Relationships/RelationshipService';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController()
@UseBefore(AuthCheck())
export class RelationshipController extends ControllerBase {
  public constructor(private relationshipService: RelationshipService) {
    super();
  }

  @Get('/follow/:id([0-9]+)')
  public async followUser(@Param('id') id: number, @LoggedUser() loggedUser: LoggedUserInterface) {

    return await this.relationshipService.followUser(id, loggedUser);

    return { status: 200, message: 'Success!' };
  }

  @Get('/block/:id([0-9]+)')
  public async blockUser(@Param('id') id: number, @LoggedUser() loggedUser: LoggedUserInterface) {

    return await this.relationshipService.blockUser(id, loggedUser);

    return { status: 200, message: 'Success!' };
  }

  @Get('/remove/:id([0-9]+)')
  public async removeUser(@Param('id') id: number, @LoggedUser() loggedUser: LoggedUserInterface) {

    return await this.relationshipService.removeUser(id, loggedUser);

    return { status: 200, message: 'Success!' };
  }

  @Get('/following')
  public async getFollowingUsers(@LoggedUser() loggedUser: LoggedUserInterface) {

    const followingUsers = await this.relationshipService.getFollowingUserIdsOf(loggedUser.userId);

    return followingUsers;
  }
}
