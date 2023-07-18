import { Injectable } from "@nestjs/common";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";

@Injectable()
export class ImageService {
   create(createImageDto: CreateImageDto) {
      return "This action adds a new image";
   }

   update(id: string, updateImageDto: UpdateImageDto) {
      return `This action updates a #${id} image`;
   }

   remove(id: string) {
      return `This action removes a #${id} image`;
   }
}
