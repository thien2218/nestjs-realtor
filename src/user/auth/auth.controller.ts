import {
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   ParseEnumPipe,
   Post,
   Res
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GenerateProductKeyDto, SigninDto, SignupDto } from "./auth.dto";
import { UserRole } from "@prisma/client";
import { Response } from "express";

@Controller("auth")
export class AuthController {
   constructor(private authService: AuthService) {}

   // POST /auth/signup/[role]
   @HttpCode(HttpStatus.CREATED)
   @Post("signup/:userRole")
   async signup(
      @Body() body: SignupDto,
      @Param("userRole", new ParseEnumPipe(UserRole)) userRole: UserRole,
      @Res() res: Response
   ) {
      const { accessToken, refreshToken } = await this.authService.signup(
         body,
         userRole
      );
      res.cookie("REFRESH_TOKEN", refreshToken, { httpOnly: true });
      return { accessToken };
   }

   // POST /auth/signin
   @Post("signin")
   async signin(@Body() body: SigninDto, @Res() res: Response) {
      const { accessToken, refreshToken } = await this.authService.signin(body);
      res.cookie("REFRESH_TOKEN", refreshToken, { httpOnly: true });
      return { accessToken };
   }

   // POST /auth/key
   @Post("key")
   generateProductKey(@Body() body: GenerateProductKeyDto) {
      return this.authService.generateProductKey(body);
   }

   // GET /auth/refresh
   @Get("refresh")
   async refresh() {}
}
