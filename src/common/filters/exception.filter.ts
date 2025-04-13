import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Something went wrong';
        let error = {}

        if(exception instanceof HttpException){
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message;
            error =
            typeof exceptionResponse === 'object' && 'error' in exceptionResponse
              ? (exceptionResponse as any).error
              : exception.name;
        }
        response
      .status(status)
      .json({
        success: false,
        message: message,
        data: {},
        error: error,
        timestamp: new Date().toISOString()
      });
    }
}