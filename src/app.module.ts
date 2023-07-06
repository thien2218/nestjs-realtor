import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
   controllers: [],
   imports: [
      UserModule,
      PrismaModule,
      ConfigModule.forRoot({ isGlobal: true })
   ],
   providers: [
      {
         provide: APP_PIPE,
         useClass: ValidationPipe
      }
   ]
})
export class AppModule {}
