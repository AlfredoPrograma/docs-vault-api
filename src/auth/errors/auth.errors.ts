import { ApplicationException } from '@/core/errors/application-exception/application-exception.error';
import { UnauthorizedException } from '@nestjs/common';

export enum AuthErrorsMessages {
  INVALID_CREDENTIALS = 'Invalid credentials',
}

export class InvalidCredentialsException extends ApplicationException {
  constructor() {
    super();
    this.message = AuthErrorsMessages.INVALID_CREDENTIALS;
  }

  toHttp() {
    return new UnauthorizedException(this.message);
  }
}
