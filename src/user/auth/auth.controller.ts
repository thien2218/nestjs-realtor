import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post("signup")
   signupUser(@Body() body: SignupDto) {
      this.authService.createUser(body);
   }
}
