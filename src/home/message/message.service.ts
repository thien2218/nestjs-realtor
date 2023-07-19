import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessageService {
   constructor(private prismaService: PrismaService) {}

   async create(createMessageDto: CreateMessageDto) {
      return "This action adds a new message";
   }

   async findAll() {
      return `This action returns all message`;
   }

   async findOneById(id: string) {
      return `This action returns a #${id} message`;
   }

   async update(id: string, updateMessageDto: UpdateMessageDto) {
      return `This action updates a #${id} message`;
   }

   async deleteById(id: string) {
      return `This action removes a #${id} message`;
   }
}
