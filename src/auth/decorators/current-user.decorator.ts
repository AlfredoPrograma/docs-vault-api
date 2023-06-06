import { CurrentUserFromToken } from '@/core/models/user';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CurrentUserFromToken => {
    const contextType = ctx.getType();

    if (contextType === 'http') {
      return ctx.switchToHttp().getRequest().user;
    }
  },
);
