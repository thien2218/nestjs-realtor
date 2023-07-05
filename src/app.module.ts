import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
   controllers: [],
   imports: [UserModule, PrismaModule],
   providers: [
      {
         provide: APP_PIPE,
         useClass: ValidationPipe
      }
   ]
})
export class AppModule {}
