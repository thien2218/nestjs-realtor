import {
   BadRequestException,
   Injectable,
   InternalServerErrorException
} from "@nestjs/common";
import { ImageResponseDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { Prisma } from "@prisma/client";
import { CreateImagesDto } from "./dto/create-images.dto";

@Injectable()
export class ImageService {
   constructor(private prismaService: PrismaService) {}

   async create(createImageDto: ImageResponseDto): Promise<ImageResponseDto> {
      const image = await this.prismaService.image.create({
         data: createImageDto
      });

      return plainToInstance(ImageResponseDto, image);
   }

   async createMany(createImagesDto: CreateImagesDto): Promise<string> {
      const images = createImagesDto.urls.map((url) => ({
         url,
         home_id: createImagesDto.home_id
      }));

      const result = await this.prismaService.image.createMany({
         data: images
      });

      if (result.count === images.length) {
         return "Successfully inserted all images";
      } else {
         throw new Error("Some or all images were inserted unsuccessfully");
      }
   }

   async update(
      id: string,
      updateImageDto: UpdateImageDto
   ): Promise<ImageResponseDto> {
      try {
         const image = await this.prismaService.image.update({
            where: { id },
            data: updateImageDto
         });

         return plainToInstance(ImageResponseDto, image);
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException("Invalid home id");
         } else {
            throw new InternalServerErrorException(
               "Something went wrong. Please try again later"
            );
         }
      }
   }

   async deleteById(id: string): Promise<string> {
      try {
         await this.prismaService.image.delete({
            where: { id }
         });

         return "Successfully deleted image";
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException("Invalid home id");
         } else {
            throw new InternalServerErrorException(
               "Something went wrong. Please try again later"
            );
         }
      }
   }
}
