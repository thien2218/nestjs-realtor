import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { HomeModule } from "./home/home.module";
import { AuthGuard } from "./utils/guards/auth.guard";

@Module({
   providers: [
      {
         provide: APP_GUARD,
         useClass: AuthGuard
      }
   ],
   controllers: [],
   imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, HomeModule]
})
export class AppModule {}
