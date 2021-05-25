import { BadRequestError } from 'routing-controllers';

export class CannotBlockUserException extends BadRequestError {
  constructor() {
    super('Cannot block this user!');
  }
}
