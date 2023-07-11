import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { CamelCaseInterceptor } from "./interceptors/camelCase.interceptor";

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         transform: true,
         transformOptions: { enableImplicitConversion: true }
      })
   );
   app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
      new CamelCaseInterceptor()
   );
   await app.listen(3001);
}
bootstrap();
