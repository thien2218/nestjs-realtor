import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export type JwtPayload = {
   sub: string;
   name: string;
   email: string;
   phone: string;
};

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest();
   return req.user;
});
