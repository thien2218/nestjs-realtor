import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export type JwtPayload = {
   sub: string;
   name: string;
   email: string;
   phone: string;
   role: UserRole;
};

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   return req.user;
});
