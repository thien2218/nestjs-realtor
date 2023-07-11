import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { CamelCaseInterceptor } from "./utils/interceptors/camelCase.interceptor";

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         transform: true,
         // Validate and transform @Query, @Param and custom param decorator parameters
         transformOptions: { enableImplicitConversion: true }
      })
   );
   app.useGlobalInterceptors(
      // Interceptors are executed in LIFO order, meaning the interceptors that come after
      // get executed first. Therefore, to chain the expected response of every interceptors,
      // add them to the argument in reverse order of the chain
      new CamelCaseInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector))
   );
   await app.listen(3001);
}
bootstrap();
