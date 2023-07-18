import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   HttpCode,
   HttpStatus
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Controller("message")
export class MessageController {
   constructor(private readonly messageService: MessageService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post()
   create(@Body() createMessageDto: CreateMessageDto) {
      return this.messageService.create(createMessageDto);
   }

   @Get()
   findAll() {
      return this.messageService.findAll();
   }

   @Get(":id")
   findOneById(@Param("id") id: string) {
      return this.messageService.findOneById(id);
   }

   @Patch(":id")
   update(@Param("id") id: string, @Body() updateMessageDto: UpdateMessageDto) {
      return this.messageService.update(id, updateMessageDto);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   deleteById(@Param("id") id: string) {
      return this.messageService.deleteById(id);
   }
}
