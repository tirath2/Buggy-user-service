import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ERROR_MSG } from 'src/Utils/error-msg';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    let resStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ERROR_MSG.SOMETHING_WENT_WRONG;
    console.log(exception);

    if (exception instanceof HttpException) {
      resStatus = exception.getStatus();
      message = exception.message;
    }

    response.status(resStatus).json({
      status: false,
      statusCode: resStatus,
      message: message,
      result: exception,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = response.statusCode;

    return {
      status: true,
      statusCode,
      result: res,
    };
  }
}
