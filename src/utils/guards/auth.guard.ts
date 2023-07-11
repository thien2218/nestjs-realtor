import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { UserInfo } from "../decorators/user.decorator";
import { PrismaService } from "src/prisma/prisma.service";

export class AuthGuard implements CanActivate {
   roles: UserRole[];

   constructor(
      private configService: ConfigService,
      private prismaService: PrismaService,
      ...roles: UserRole[]
   ) {
      this.roles = roles;
   }

   async canActivate(ctx: ExecutionContext): Promise<boolean> {
      if (this.roles) {
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

            if (this.roles.includes(user.role)) {
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
