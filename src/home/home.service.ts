import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PropertyType } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { HomeResponseDto } from "./dto/home-response.dto";
import { CreateHomeDto } from "./dto/create-home.dto";
import { UpdateHomeDto } from "./dto/update-home.dto";

type GetHomeFilter = {
   city?: string;
   price?: {
      gte?: number;
      lte?: number;
   };
   property_type?: PropertyType;
};

@Injectable()
export class HomeService {
   constructor(private prismaService: PrismaService) {}

   async findAll(filter: GetHomeFilter): Promise<HomeResponseDto[]> {
      const homes = await this.prismaService.home.findMany({
         include: {
            images: {
               select: {
                  url: true
               },
               take: 1
            }
         },
         where: filter
      });

      if (!homes.length) {
         throw new NotFoundException("No homes matched");
      }

      return homes.map((data) => {
         const { images, ...homeData } = data;
         const home = { ...homeData, image: images[0].url };
         return plainToInstance(HomeResponseDto, home);
      });
   }

   async findOneById(id: string): Promise<HomeResponseDto> {
      const home = await this.prismaService.home.findUnique({
         include: {
            images: {
               select: {
                  url: true
               }
            },
            realtors: true
         },
         where: { id }
      });

      if (!home) {
         throw new NotFoundException("No homes matched");
      }

      return plainToInstance(HomeResponseDto, home);
   }

   async create(body: CreateHomeDto, userId: string): Promise<CreateHomeDto> {
      const { images, cooperators, ...homeData } = body;
      const realtors = [...cooperators.map((id) => ({ id })), { id: userId }];

      try {
         const home = await this.prismaService.home.create({
            data: {
               ...homeData,
               realtors: {
                  connect: realtors
               }
            }
         });

         const homeImages = images.map((image) => {
            return { ...image, home_id: home.id };
         });

         await this.prismaService.image.createMany({
            data: homeImages
         });

         return plainToInstance(CreateHomeDto, {
            ...home,
            images,
            cooperators
         });
      } catch (err) {
         throw new BadRequestException("Invalid realtor id(s)");
      }
   }

   async update(
      data: UpdateHomeDto,
      homeId: string,
      userId: string
   ): Promise<CreateHomeDto> {
      try {
         const home = await this.prismaService.home.update({
            where: {
               id: homeId,
               realtors: {
                  some: { id: userId }
               }
            },
            data
         });

         return plainToInstance(CreateHomeDto, home);
      } catch (err) {
         throw new BadRequestException("Invalid home id");
      }
   }

   async deleteById(homeId: string, userId: string): Promise<string> {
      try {
         await this.prismaService.home.delete({
            where: {
               id: homeId,
               realtors: {
                  some: {
                     id: userId
                  }
               }
            }
         });

         return "Home successfully deleted";
      } catch (err) {
         throw new BadRequestException("Invalid home id");
      }
   }
}
