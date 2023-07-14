import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";

@Module({
   imports: [PrismaModule, AuthModule],
   controllers: [],
   providers: []
})
export class UserModule {}
