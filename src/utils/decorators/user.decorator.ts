import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export type UserPayload = {
   sub: string;
   full_name: string;
   email: string;
   phone: string;
   role: UserRole;
   // Only appear upon refresh requests
   refresh_token?: string;
};

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   return req.user;
});
