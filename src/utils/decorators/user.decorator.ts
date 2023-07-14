import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export type UserInfo = {
   id: string;
   name: string;
   email: string;
};

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   const authToken = req.headers.authorization?.replace("Bearer ", "");
   const user = jwt.decode(authToken);
   return user;
});
