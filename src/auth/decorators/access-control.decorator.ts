import { SetMetadata } from '@nestjs/common';

export enum ACCESS_KEYS {
  PRIVATE = 'PRIVATE_ACCESS',
}

export const PrivateAccess = () => SetMetadata(ACCESS_KEYS.PRIVATE, true);
