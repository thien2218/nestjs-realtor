import { CanActivate, ExecutionContext } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { UserInfo } from "../decorators/user.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { Reflector } from "@nestjs/core";

export class AuthGuard implements CanActivate {
   constructor(
      private configService: ConfigService,
      private prismaService: PrismaService,
      private reflector: Reflector
   ) {}

   async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const roles = this.reflector.get<string[]>("roles", ctx.getHandler());

      if (roles && roles.length) {
         const req = ctx.switchToHttp().getRequest();
         const authToken = req.headers.authorization?.split("Bearer ")[1];

         try {
            const payload = jwt.verify(
               authToken,
               this.configService.get("JWT_SECRET") as string
            ) as UserInfo;

            const user = await this.prismaService.user.findUniqueOrThrow({
               where: {
                  id: payload.id
               }
            });

            if (roles.includes(user.role)) {
               return true;
            }

            return false;
         } catch {
            return false;
         }
      }

      return true;
   }
}
