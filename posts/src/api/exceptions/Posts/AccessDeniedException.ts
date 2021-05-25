import { ForbiddenError } from 'routing-controllers';

export class AccessDeniedException extends ForbiddenError {
  constructor() {
    super('Cannot view this post!');
  }
}
