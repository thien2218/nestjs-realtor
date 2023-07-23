import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { MessageResponseDto } from "./dto/message-response.dto";

@Injectable()
export class MessageService {
   constructor(private prismaService: PrismaService) {}

   async create(
      createMessageDto: CreateMessageDto,
      homeId: string
   ): Promise<MessageResponseDto> {
      const message = await this.prismaService.message.create({
         data: {
            ...createMessageDto,
            home_id: homeId
         },
         include: {
            sender: true,
            receiver: true
         }
      });

      return plainToInstance(MessageResponseDto, message);
   }

   async findAll(homeId: string): Promise<MessageResponseDto[]> {
      const messages = await this.prismaService.message.findMany({
         where: { home_id: homeId }
      });

      if (!messages) {
         throw new NotFoundException();
      }

      return messages.map((message) =>
         plainToInstance(MessageResponseDto, message)
      );
   }

   async deleteById(
      userId: string,
      messageId: string,
      homeId: string
   ): Promise<string> {
      try {
         await this.prismaService.message.delete({
            where: {
               id: messageId,
               home_id: homeId,
               from: userId
            }
         });

         return "Message deleted successfully";
      } catch (err) {
         throw new BadRequestException(
            "Message not found in with the given home id"
         );
      }
   }
}
