import { NotFoundError } from 'routing-controllers';

export class PostNotFoundException extends NotFoundError {
  constructor() {
    super('Post not found!');
  }
}
