import {
   Controller,
   Get,
   Post,
   Body,
   Param,
   Delete,
   HttpCode,
   HttpStatus
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Roles } from "src/utils/decorators/roles.decorator";
import { DeleteMessageDto } from "./dto/delete-message.dto";

@Controller("home/:home_id/message")
@Roles("BUYER", "REALTOR")
export class MessageController {
   constructor(private readonly messageService: MessageService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post()
   create(
      @Body() createMessageDto: CreateMessageDto,
      @Param("home_id") homeId: string
   ) {
      return this.messageService.create(createMessageDto, homeId);
   }

   @Get()
   findAll(@Param("home_id") homeId: string) {
      return this.messageService.findAll(homeId);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   deleteById(
      @Body() { user_id }: DeleteMessageDto,
      @Param("id") id: string,
      @Param("home_id") homeId: string
   ) {
      return this.messageService.deleteById(user_id, id, homeId);
   }
}
