import { BadRequestError } from 'routing-controllers';

export class CannotFollowException extends BadRequestError {
  constructor() {
    super('Cannot follow this user!');
  }
}
