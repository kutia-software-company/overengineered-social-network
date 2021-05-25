import { Service } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostRepository } from '@base/api/repositories/Users/PostRepository';
import { PostNotFoundException } from '@base/api/exceptions/Posts/PostNotFoundException';
import { Post } from '@base/api/models/Posts/Post';

@Service()
export class PostService {
  constructor(
    @InjectRepository() private postRepository: PostRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.postRepository.getManyAndCount(resourceOptions);
  }

  public async geUserPosts(userId: number) {
    return await this.postRepository.geUserPosts(userId);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedPostOrFail(id, resourceOptions);
  }

  public async create(data: any) {
    let post = await this.postRepository.createPost(data);

    this.eventDispatcher.dispatch('onPostCreate', post);

    return post;
  }

  public async updateOneById(post: Post, data: object) {
    return await this.postRepository.update(post, data);
  }

  public async deleteOneById(id: number) {
    return await this.postRepository.delete(id);
  }

  public async getNewsfeedPosts(followingIds: number[]) {
    return await this.postRepository.getNewsfeedPosts(followingIds);
  }

  private async getRequestedPostOrFail(id: number, resourceOptions?: object) {
    let post = await this.postRepository.getOneById(id, resourceOptions);

    if (!post) {
      throw new PostNotFoundException();
    }

    return post;
  }
}
