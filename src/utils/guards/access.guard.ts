import {
   ExecutionContext,
   Injectable,
   UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { UserRole } from "@prisma/client";

@Injectable()
export class AccessGuard extends AuthGuard("jwt") {
   constructor(private reflector: Reflector) {
      super();
   }

   handleRequest(err: any, user: any, info: any, ctx: ExecutionContext) {
      const roles = this.reflector.get<UserRole[]>("roles", ctx.getHandler());

      if (!roles) {
         return user;
      }

      if (err || !user) {
         throw err || new UnauthorizedException();
      }

      const hasRole = () => roles.indexOf(user.role) > -1;
      if (user.role && hasRole()) {
         return user;
      } else {
         throw new UnauthorizedException();
      }
   }
}
