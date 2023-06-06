import { ApplicationException } from '@/core/errors/application-exception/application-exception.error';
import { ConflictException } from '@nestjs/common';

export enum UserErrorsMessages {
  USER_ALREADY_REGISTERED = 'User already registered',
}
export class UserAlreadyRegisteredError extends ApplicationException {
  constructor() {
    super();
    this.message = UserErrorsMessages.USER_ALREADY_REGISTERED;
  }

  toHttp() {
    return new ConflictException(this.message);
  }
}
