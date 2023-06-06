import { HttpException } from '@nestjs/common';

export function isApplicationException(
  error: Error,
): error is ApplicationException {
  return error.name === 'SERVICE_EXCEPTION';
}

export abstract class ApplicationException extends Error {
  constructor() {
    super();
    this.name = 'SERVICE_EXCEPTION';
  }

  abstract toHttp(): HttpException;
}
