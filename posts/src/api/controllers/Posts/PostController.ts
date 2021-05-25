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
} from 'routing-controllers';
import { Service } from 'typedi';
import { ControllerBase } from '@base/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { PostService } from '@base/api/services/Posts/PostService';
import { PostCreateRequest } from '@base/api/requests/Users/PostCreateRequest';
import { PostUpdateRequest } from '@base/api/requests/Users/PostUpdateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ViewPost } from '@base/api/gates/ViewPost';
import { AccessDeniedException } from '@base/api/exceptions/Posts/AccessDeniedException';
import { DeletePost } from '@base/api/gates/DeletePost';
import { UpdatePost } from '@base/api/gates/UpdatePost';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/')
@UseBefore(AuthCheck())
export class PostController extends ControllerBase {
  public constructor(private postService: PostService) {
    super();
  }

  @Get()
  public async geUserPosts(@QueryParams() parseResourceOptions: RequestQueryParser, @Req() request: any) {
    const resourceOptions = parseResourceOptions.getAll();

    const userId = request.loggedUser.userId;

    return await this.postService.geUserPosts(userId);
  }

  @Get(':id')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser, @Req() request: any) {
    const resourceOptions = parseResourceOptions.getAll();

    const post = await this.postService.findOneById(id, resourceOptions);

    if(ViewPost.denied(request.loggedUser.userId, post)) {
        throw new AccessDeniedException();
    }

    return post;
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() data: PostCreateRequest, @Req() request: any) {
    let post: any = data;

    post.user_id = request.loggedUser.userId;

    return await this.postService.create(post);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() data: PostUpdateRequest, @Req() request: any) {
    const post = await this.postService.findOneById(id);

    if(UpdatePost.denied(request.loggedUser.userId, post)) {
      throw new AccessDeniedException();
    }

    return await this.postService.updateOneById(post, data);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number, @Req() request: any) {
    const post = await this.postService.findOneById(id);

    if(DeletePost.denied(request.loggedUser.userId, post)) {
      throw new AccessDeniedException();
    }

    return await this.postService.deleteOneById(id);
  }
}
