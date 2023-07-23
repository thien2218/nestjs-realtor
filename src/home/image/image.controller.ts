import {
   Controller,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   HttpCode,
   HttpStatus
} from "@nestjs/common";
import { ImageService } from "./image.service";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { CreateImagesDto } from "./dto/create-images.dto";
import { Roles } from "src/utils/decorators/roles.decorator";
import { User, UserPayload } from "src/utils/decorators/user.decorator";

@Controller("home/:home_id/image")
@Roles("REALTOR")
export class ImageController {
   constructor(private readonly imageService: ImageService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post()
   create(
      @Body() { url }: CreateImageDto,
      @Param("home_id") homeId: string,
      @User() { sub }: UserPayload
   ) {
      return this.imageService.create(url, homeId, sub);
   }

   @HttpCode(HttpStatus.CREATED)
   @Post()
   createMany(
      @Body() createImagesDto: CreateImagesDto,
      @Param("home_id") homeId: string,
      @User() { sub }: UserPayload
   ) {
      return this.imageService.createMany(createImagesDto, homeId, sub);
   }

   @Patch(":id")
   update(
      @Body() updateImageDto: UpdateImageDto,
      @Param("id") id: string,
      @Param("home_id") homeId: string,
      @User() { sub }: UserPayload
   ) {
      return this.imageService.update(updateImageDto, id, homeId, sub);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   deleteById(
      @Param("id") id: string,
      @Param("home_id") homeId: string,
      @User() { sub }: UserPayload
   ) {
      return this.imageService.deleteById(id, homeId, sub);
   }
}
