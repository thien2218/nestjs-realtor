import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { PrismaModule } from "src/prisma/prisma.module";

@Injectable()
export class MessageService {
   constructor(private prismaService: PrismaModule) {}

   create(createMessageDto: CreateMessageDto) {
      return "This action adds a new message";
   }

   findAll() {
      return `This action returns all message`;
   }

   findOneById(id: string) {
      return `This action returns a #${id} message`;
   }

   update(id: string, updateMessageDto: UpdateMessageDto) {
      return `This action updates a #${id} message`;
   }

   deleteById(id: string) {
      return `This action removes a #${id} message`;
   }
}
