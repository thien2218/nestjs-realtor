import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { HomeModule } from "./home/home.module";
import { PrismaModule } from "./prisma/prisma.module";
import { DecodeJWTInterceptor } from "./utils/interceptors/decodeJwt.interceptor";
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
         provide: APP_INTERCEPTOR,
         useClass: DecodeJWTInterceptor
      },
      {
         provide: APP_GUARD,
         useClass: AccessGuard
      }
   ]
})
export class AppModule {}
