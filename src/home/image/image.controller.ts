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

@Controller("image")
export class ImageController {
   constructor(private readonly imageService: ImageService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post()
   create(@Body() createImageDto: ImageResponseDto) {
      return this.imageService.create(createImageDto);
   }

   @HttpCode(HttpStatus.CREATED)
   @Post()
   createMany(@Body() createImagesDto: CreateImagesDto) {
      return this.imageService.createMany(createImagesDto);
   }

   @Patch(":id")
   update(@Param("id") id: string, @Body() updateImageDto: UpdateImageDto) {
      return this.imageService.update(id, updateImageDto);
   }

   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   deleteById(@Param("id") id: string) {
      return this.imageService.deleteById(id);
   }
}
