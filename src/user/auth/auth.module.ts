import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtStrategy } from "./strategies/accessToken.strategy";
import { RefreshStrategy } from "./strategies/refreshToken.strategy";

@Module({
   imports: [PrismaModule],
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy, RefreshStrategy]
})
export class AuthModule {}
