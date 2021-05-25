import {
    Param,
    Get,
    JsonController,
    Post,
    Body,
    Put,
    Delete,
    HttpCode,
    UseBefore,
    QueryParams,
    Req,
    UnauthorizedError,
  } from 'routing-controllers';

import { ControllerBase } from '@base/abstracts/ControllerBase';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { PostService } from '@base/api/services/Posts/PostService';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { LoggedUserInterface } from '@base/api/interfaces/LoggedUserInterface';
import { LoggedUser } from '@base/decorators/LoggedUser';
import fetch from 'node-fetch'

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/newsfeed')
@UseBefore(AuthCheck())
export class NewsfeedController extends ControllerBase {

    public constructor(private postService: PostService) {
        super();
    }
    @Get()
    public async getNewsfeedPosts(@LoggedUser() loggedUser: LoggedUserInterface) {
        var followingIds: number[] = await this.getFollowingIds(loggedUser);

        return await this.postService.getNewsfeedPosts(followingIds);
    }

    private async getFollowingIds (loggedUser: LoggedUserInterface) {
        const authHeader = loggedUser.authHeader;
    
        const authRequest = await fetch('http://localhost:5000/relationships/following', {
          headers: {"Authorization": authHeader}
        })
    
        if(!authRequest.ok) {
          throw new UnauthorizedError('Unauthorized');
        }
    
        var json = await authRequest.json();

        var ids: number[] = [];

        json.forEach((element: number) => {
          ids.push(element);
        });

        return ids;
      };
}