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
import { ImageResponseDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { CreateImagesDto } from "./dto/create-images.dto";
import { Roles } from "src/utils/decorators/roles.decorator";

@Controller("image")
export class ImageController {
   constructor(private readonly imageService: ImageService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post()
   @Roles("REALTOR")
   create(@Body() createImageDto: ImageResponseDto) {
      return this.imageService.create(createImageDto);
   }

   @HttpCode(HttpStatus.CREATED)
   @Post()
   @Roles("REALTOR")
   createMany(@Body() createImagesDto: CreateImagesDto) {
      return this.imageService.createMany(createImagesDto);
   }

   @Patch(":id")
   @Roles("REALTOR")
   update(@Param("id") id: string, @Body() updateImageDto: UpdateImageDto) {
      return this.imageService.update(id, updateImageDto);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   @Roles("REALTOR")
   deleteById(@Param("id") id: string) {
      return this.imageService.deleteById(id);
   }
}
