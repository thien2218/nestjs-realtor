import {
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   ParseEnumPipe,
   Post,
   Res,
   UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GenerateProductKeyDto, SigninDto, SignupDto } from "./auth.dto";
import { UserRole } from "@prisma/client";
import { Response } from "express";
import { RefreshGuard } from "src/utils/guards/refresh.guard";
import { UserPayload, User } from "src/utils/decorators/user.decorator";

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

      res.cookie("realtor-refresh-token", refreshToken, {
         httpOnly: true,
         path: "/refresh"
      });

      res.send({ accessToken });
   }

   // POST /auth/signin
   @Post("signin")
   async signin(@Body() body: SigninDto, @Res() res: Response) {
      const { accessToken, refreshToken } = await this.authService.signin(body);

      res.cookie("realtor-refresh-token", refreshToken, {
         httpOnly: true,
         path: "/refresh"
      });

      res.send({ accessToken });
   }

   // POST /auth/key
   @Post("key")
   generateProductKey(@Body() body: GenerateProductKeyDto) {
      return this.authService.generateProductKey(body);
   }

   // GET /auth/refresh
   @UseGuards(RefreshGuard)
   @Get("refresh")
   async refresh(@Res() res: Response, @User() user: UserPayload) {
      const { accessToken, refreshToken } = await this.authService.refresh(
         user.sub,
         user.refresh_token as string
      );

      res.cookie("realtor-refresh-token", refreshToken, {
         httpOnly: true,
         path: "/refresh"
      });

      res.send({ accessToken });
   }
}
