import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { UserModule } from "./user/user.module";

@Module({
   controllers: [],
   imports: [UserModule],
   providers: [
      {
         provide: APP_PIPE,
         useClass: ValidationPipe
      }
   ]
})
export class AppModule {}
