import { Module } from "@nestjs/common";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { ImageModule } from './image/image.module';
import { MessageModule } from './message/message.module';

@Module({
   imports: [PrismaModule, ImageModule, MessageModule],
   controllers: [HomeController],
   providers: [HomeService]
})
export class HomeModule {}
