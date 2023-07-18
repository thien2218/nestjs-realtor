import {
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor
} from "@nestjs/common";
import { camelCase, isPlainObject, isArray } from "lodash";
import { Observable, map } from "rxjs";

@Injectable()
export class CamelCaseInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map((data) => this.transformToCamelCase(data)));
   }

   private transformToCamelCase(obj: any): any {
      if (isArray(obj) && isPlainObject(obj[0])) {
         return obj.map((item) => this.transformToCamelCase(item));
      } else if (isPlainObject(obj)) {
         const result: any = {};

         for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
               const camelCaseKey = camelCase(key);
               const value = obj[key];

               result[camelCaseKey] = isPlainObject(value)
                  ? this.transformToCamelCase(value)
                  : value;
            }
         }

         return result;
      } else {
         return obj;
      }
   }
}
