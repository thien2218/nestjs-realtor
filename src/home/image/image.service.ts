import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   UnauthorizedException
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

   private async homeOwnedByRealtor(
      homeId: string,
      realtorId: string
   ): Promise<boolean> {
      const home = await this.prismaService.home.findUnique({
         where: { id: homeId },
         include: { realtors: true }
      });

      if (!home) {
         throw new Error("Home not found");
      }

      return home.realtors.some((realtor) => realtor.id === realtorId);
   }

   async create(
      url: string,
      homeId: string,
      userId: string
   ): Promise<CreateImageDto> {
      const validRealtor = await this.homeOwnedByRealtor(homeId, userId);

      if (!validRealtor) {
         throw new UnauthorizedException();
      }

      const image = await this.prismaService.image.create({
         data: {
            url,
            home_id: homeId
         }
      });

      return plainToInstance(CreateImageDto, image);
   }

   async createMany(
      createImagesDto: CreateImagesDto,
      homeId: string,
      userId: string
   ): Promise<string> {
      const validRealtor = await this.homeOwnedByRealtor(homeId, userId);

      if (!validRealtor) {
         throw new UnauthorizedException();
      }

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
   ): Promise<CreateImageDto> {
      try {
         const validRealtor = await this.homeOwnedByRealtor(homeId, userId);

         if (!validRealtor) {
            throw new UnauthorizedException();
         }

         const image = await this.prismaService.image.update({
            where: { id: imageId, home_id: homeId },
            data: updateImageDto
         });

         return plainToInstance(CreateImageDto, image);
      } catch (err) {
         if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException(
               "Image not found in with the given home id"
            );
         } else {
            throw new InternalServerErrorException(
               "Something went wrong. Please try again later"
            );
         }
      }
   }

   async deleteById(
      imageId: string,
      homeId: string,
      userId: string
   ): Promise<string> {
      try {
         const validRealtor = await this.homeOwnedByRealtor(homeId, userId);

         if (!validRealtor) {
            throw new UnauthorizedException();
         }

         await this.prismaService.image.delete({
            where: { id: imageId, home_id: homeId }
         });

         return "Image deleted successfully";
      } catch (err) {
         if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new BadRequestException(
               "Image not found in with the given home id"
            );
         } else {
            throw new InternalServerErrorException(
               "Something went wrong. Please try again later"
            );
         }
      }
   }
}
