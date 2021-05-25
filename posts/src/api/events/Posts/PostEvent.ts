import { EventSubscriber, On } from 'event-dispatch';

@EventSubscriber()
export class PostEvent {

  @On('onPostCreate')
  public onUserCreate(post: any) {
    console.log('Post ' + post.id + ' created!');
  }

}
