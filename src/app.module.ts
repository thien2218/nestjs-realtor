import {
   ClassSerializerInterceptor,
   Module,
   ValidationPipe
} from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { HomeModule } from "./home/home.module";

@Module({
   controllers: [],
   imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      UserModule,
      PrismaModule,
      HomeModule
   ]
})
export class AppModule {}
