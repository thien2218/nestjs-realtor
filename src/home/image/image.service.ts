import {
   BadRequestException,
   Injectable,
   InternalServerErrorException
} from "@nestjs/common";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { Prisma } from "@prisma/client";
import { CreateImagesDto } from "./dto/create-images.dto";

@Injectable()
export class ImageService {
   constructor(private prismaService: PrismaService) {}

   async create(createImageDto: CreateImageDto) {
      const image = await this.prismaService.image.create({
         data: createImageDto
      });

      return plainToInstance(CreateImageDto, image);
   }

   async createMany(createImagesDto: CreateImagesDto) {
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

   async update(id: string, updateImageDto: UpdateImageDto) {
      try {
         const image = await this.prismaService.image.update({
            where: { id },
            data: updateImageDto
         });

         return plainToInstance(CreateImageDto, image);
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

   async deleteById(id: string) {
      try {
         await this.prismaService.image.delete({
            where: { id }
         });
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
