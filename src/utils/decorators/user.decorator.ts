import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import * as jwt from "jsonwebtoken";

export type UserInfo = {
   id: string;
   name: string;
   email: string;
   role: UserRole;
};

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   const authToken = req.headers.authorization?.split("Bearer ")[1];
   const user = jwt.decode(authToken);
   return user;
});
