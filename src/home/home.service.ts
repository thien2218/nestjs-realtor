import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateHomeDto, GetHomeDto } from "./home.dto";
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
   constructor(private readonly prismaService: PrismaService) {}

   async getHomes(filter: GetHomeFilter): Promise<GetHomeDto[]> {
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

   async getHomeById(id: string): Promise<GetHomeDto> {
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
                  name: true,
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

   async createHome(body: CreateHomeDto): Promise<CreateHomeDto> {
      const { images, cooperates, ...homeData } = body;

      const realtors = [...cooperates.map((id) => ({ id }))];

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

      return plainToInstance(CreateHomeDto, { ...home, images, cooperates });
   }
}
