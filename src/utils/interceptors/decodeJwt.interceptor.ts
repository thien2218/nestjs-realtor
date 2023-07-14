import {
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class DecodeJWTInterceptor implements NestInterceptor {
   constructor(private jwtService: JwtService) {}

   intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
      const req = ctx.switchToHttp().getRequest();
      const authToken = req.headers.authorization?.replace("Bearer ", "");
      const user = this.jwtService.decode(authToken);
      req["user"] = user;
      return next.handle();
   }
}
