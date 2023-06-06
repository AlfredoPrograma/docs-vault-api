import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { isApplicationException } from './application-exception.error';

export class ApplicationExceptionInterceptor implements NestInterceptor {
  constructor(private readonly isModeDebug) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<Error>,
  ): Observable<Error> {
    return next.handle().pipe(
      catchError((error: Error) => {
        const contextType = context.getType();

        if (this.isModeDebug) {
          console.log(error);
        }

        if (isApplicationException(error) && contextType === 'http') {
          throw error.toHttp();
        }

        throw error;
      }),
    );
  }
}
