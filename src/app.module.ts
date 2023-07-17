import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { HomeModule } from "./home/home.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AccessGuard } from "./utils/guards/access.guard";

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      PrismaModule,
      UserModule,
      HomeModule
   ],
   controllers: [],
   providers: [
      {
         provide: APP_GUARD,
         useClass: AccessGuard
      }
   ]
})
export class AppModule {}
