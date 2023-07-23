import {
   BadRequestException,
   Injectable,
   NotFoundException
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { HomeResponseDto, GetHomeDto, UpdateHomeDto } from "./home.dto";
import { PropertyType } from "@prisma/client";
import { plainToInstance } from "class-transformer";

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

   async findAll(filter: GetHomeFilter): Promise<GetHomeDto[]> {
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
         return plainToInstance(GetHomeDto, home);
      });
   }

   async findOneById(id: string): Promise<GetHomeDto> {
      const home = await this.prismaService.home.findUnique({
         include: {
            images: {
               select: {
                  url: true
               }
            },
            realtors: {
               select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  phone: true,
                  email: true
               }
            }
         },
         where: { id }
      });

      if (!home) {
         throw new NotFoundException("No homes matched");
      }

      return plainToInstance(GetHomeDto, home);
   }

   async create(
      body: HomeResponseDto,
      userId: string
   ): Promise<HomeResponseDto> {
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

         return plainToInstance(HomeResponseDto, {
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
   ): Promise<HomeResponseDto> {
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

         return plainToInstance(HomeResponseDto, home);
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
