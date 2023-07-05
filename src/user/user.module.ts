import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PassportModule } from "@nestjs/passport";

@Module({
   imports: [PrismaModule],
   controllers: [AuthController],
   providers: [AuthService, PassportModule]
})
export class UserModule {}
