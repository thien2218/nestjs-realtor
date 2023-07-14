import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
   imports: [
      AuthModule,
      JwtModule.register({
         global: true,
         signOptions: {
            expiresIn: 60 * 60
         }
      })
   ],
   controllers: [],
   providers: []
})
export class UserModule {}
