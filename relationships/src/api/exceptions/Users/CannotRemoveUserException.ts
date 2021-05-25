import { BadRequestError } from 'routing-controllers';

export class CannotRemoveUserException extends BadRequestError {
  constructor() {
    super('Cannot remove this user!');
  }
}
