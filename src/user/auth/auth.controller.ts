import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Param,
   ParseEnumPipe,
   Post
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GenerateProductKeyDto, SigninDto, SignupDto } from "./auth.dto";
import { UserRole } from "@prisma/client";

@Controller("auth")
export class AuthController {
   constructor(private authService: AuthService) {}

   // POST /auth/signup/[role]
   @HttpCode(HttpStatus.CREATED)
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
   generateProductKey(@Body() body: GenerateProductKeyDto) {
      return this.authService.generateProductKey(body);
   }
}
