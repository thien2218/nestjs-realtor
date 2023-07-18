import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
   constructor(protected configService: ConfigService) {
      super({
         jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => {
               return req.cookies?.REFRESH_TOKEN;
            }
         ]),
         secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET"),
         passReqToCallback: true
      });
   }

   async validate(req: Request, payload: any) {
      const refreshToken = req.cookies?.REFRESH_TOKEN;
      return {
         ...payload,
         refreshToken
      };
   }
}
