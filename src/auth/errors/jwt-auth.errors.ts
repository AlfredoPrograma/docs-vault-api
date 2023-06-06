import { ApplicationException } from '@/core/errors/application-exception/application-exception.error';

import { UnauthorizedException } from '@nestjs/common';

export enum JwtErrorMessages {
  MALFORMED_TOKEN = 'Malformed token',
  INVALID_TOKEN = 'Invalid token',
}

export class MalformedTokenException extends ApplicationException {
  constructor() {
    super();
    this.message = JwtErrorMessages.MALFORMED_TOKEN;
  }

  toHttp() {
    return new UnauthorizedException(this.message);
  }
}

export class InvalidTokenException extends ApplicationException {
  constructor() {
    super();
    this.message = JwtErrorMessages.INVALID_TOKEN;
  }

  toHttp() {
    return new UnauthorizedException(this.message);
  }
}
