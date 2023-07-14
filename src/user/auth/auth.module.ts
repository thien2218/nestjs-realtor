import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
   imports: [
      JwtModule.register({
         global: true,
         secret: process.env.ACCESS_TOKEN_SECRET,
         signOptions: {
            expiresIn: 60 * 60
         }
      })
   ],
   providers: [AuthService],
   controllers: [AuthController]
})
export class AuthModule {}
