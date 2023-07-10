import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { snakeCase } from "lodash";

@Injectable()
export class SnakeCasePipe implements PipeTransform {
   transform(value: any, metadata: ArgumentMetadata) {
      if (value && typeof value === "object" && metadata.type === "body") {
         return this.transformToSnakeCase(value);
      }
      return value;
   }

   private transformToSnakeCase(obj: any): any {
      if (Array.isArray(obj)) {
         return obj.map((item) => this.transformToSnakeCase(item));
      } else {
         const result: any = {};
         for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
               const snakeCaseKey = snakeCase(key);
               const value = obj[key];

               result[snakeCaseKey] =
                  typeof value === "object"
                     ? this.transformToSnakeCase(value)
                     : value;
            }
         }

         return result;
      }
   }
}
