import { Body, Controller, Param, ParseEnumPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GenerateAccessKeyDto, SigninDto, SignupDto } from "./auth.dto";
import { UserRole } from "@prisma/client";

@Controller("auth")
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   // POST /auth/signup/[role]
   @Post("signup/:userRole")
   async signup(
      @Body() body: SignupDto,
      @Param("userRole", new ParseEnumPipe(UserRole)) userRole: UserRole
   ) {
      return this.authService.signup(body, userRole);
   }

   // POST /auth/signin
   @Post("signin")
   signin(@Body() body: SigninDto) {
      return this.authService.signin(body);
   }

   // POST /auth/key
   @Post("key")
   generateAccessKey(@Body() body: GenerateAccessKeyDto) {
      return this.authService.generateAccessKey(body);
   }
}
