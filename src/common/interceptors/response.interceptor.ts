import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, timestamp } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data)=> ({
                success: true,
                message: 'Success',
                data: data,
                error: {},
                timestamp: new Date().toISOString()
            })
            )
        );
    }

}