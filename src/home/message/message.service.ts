import {
   BadRequestException,
   Injectable,
   NotFoundException,
   UnauthorizedException
} from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { plainToInstance } from "class-transformer";

@Injectable()
export class MessageService {
   constructor(private prismaService: PrismaService) {}

   async create(
      createMessageDto: CreateMessageDto,
      homeId: string
   ): Promise<CreateMessageDto> {
      const message = await this.prismaService.message.create({
         data: {
            ...createMessageDto,
            home_id: homeId
         }
      });

      return plainToInstance(CreateMessageDto, message);
   }

   async findAll(homeId: string): Promise<CreateMessageDto[]> {
      const messages = await this.prismaService.message.findMany({
         where: { home_id: homeId }
      });

      if (!messages) {
         throw new NotFoundException();
      }

      return messages.map((message) =>
         plainToInstance(CreateMessageDto, message)
      );
   }

   async deleteById(
      userId: string,
      messageId: string,
      homeId: string
   ): Promise<string> {
      const message = await this.prismaService.message.findUnique({
         where: {
            id: messageId,
            home_id: homeId
         }
      });

      if (!message) {
         throw new BadRequestException("No message found");
      } else if (message.from !== userId) {
         throw new UnauthorizedException();
      }

      await this.prismaService.message.delete({
         where: { id: messageId }
      });

      return "Message deleted successfully";
   }
}
