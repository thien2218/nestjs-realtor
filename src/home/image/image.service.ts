import {
   BadRequestException,
   Injectable,
   UnauthorizedException
} from "@nestjs/common";
import { UpdateImageDto } from "./dto/update-image.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { CreateImagesDto } from "./dto/create-images.dto";
import { ImageResponseDto } from "./dto/image-response.dto";

@Injectable()
export class ImageService {
   constructor(private prismaService: PrismaService) {}

   private async homeOwnedByRealtor(homeId: string, realtorId: string) {
      const home = await this.prismaService.home.findUnique({
         where: {
            id: homeId,
            realtors: {
               some: { id: realtorId }
            }
         }
      });

      if (!home) {
         throw new UnauthorizedException();
      }
   }

   async create(
      url: string,
      homeId: string,
      userId: string
   ): Promise<ImageResponseDto> {
      await this.homeOwnedByRealtor(homeId, userId);

      const image = await this.prismaService.image.create({
         data: {
            url,
            home_id: homeId
         }
      });

      return plainToInstance(ImageResponseDto, image);
   }

   async createMany(
      createImagesDto: CreateImagesDto,
      homeId: string,
      userId: string
   ): Promise<string> {
      await this.homeOwnedByRealtor(homeId, userId);

      const images = createImagesDto.urls.map((url) => ({
         url,
         home_id: homeId
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
      updateImageDto: UpdateImageDto,
      imageId: string,
      homeId: string,
      userId: string
   ): Promise<ImageResponseDto> {
      try {
         const image = await this.prismaService.image.update({
            where: {
               id: imageId,
               home: {
                  id: homeId,
                  realtors: {
                     some: {
                        id: userId
                     }
                  }
               }
            },
            data: updateImageDto
         });

         return plainToInstance(ImageResponseDto, image);
      } catch (err) {
         throw new BadRequestException("Image not found");
      }
   }

   async deleteById(
      imageId: string,
      homeId: string,
      userId: string
   ): Promise<string> {
      try {
         await this.prismaService.image.delete({
            where: {
               id: imageId,
               home: {
                  id: homeId,
                  realtors: {
                     some: {
                        id: userId
                     }
                  }
               }
            }
         });

         return "Image deleted successfully";
      } catch (err) {
         throw new BadRequestException("Image not found");
      }
   }
}
