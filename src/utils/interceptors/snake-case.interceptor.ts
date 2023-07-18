import {
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor
} from "@nestjs/common";
import { snakeCase, isPlainObject, isArray } from "lodash";
import { Observable } from "rxjs";

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      request.body = this.transformToSnakeCase(request.body);
      return next.handle();
   }

   private transformToSnakeCase(obj: any): any {
      if (isArray(obj) && isPlainObject(obj[0])) {
         return obj.map((item) => this.transformToSnakeCase(item));
      } else if (isPlainObject(obj)) {
         const result: any = {};

         for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
               const snakeCaseKey = snakeCase(key);
               const value = obj[key];

               result[snakeCaseKey] = isPlainObject(value)
                  ? this.transformToSnakeCase(value)
                  : value;
            }
         }

         return result;
      } else {
         return obj;
      }
   }
}
