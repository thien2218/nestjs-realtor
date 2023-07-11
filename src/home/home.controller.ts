import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   Query,
   UseInterceptors
} from "@nestjs/common";
import { HomeService } from "./home.service";
import { CreateHomeDto, GetHomeDto } from "./home.dto";
import { PropertyType } from "@prisma/client";
import { SnakeCaseInterceptor } from "src/interceptors/snakeCase.interceptor";

@Controller("home")
export class HomeController {
   constructor(private readonly homeService: HomeService) {}

   @Get()
   getHomes(
      @Query("city") city?: string,
      @Query("minPrice") minPrice?: string,
      @Query("maxPrice") maxPrice?: string,
      @Query("propType") propertyType?: PropertyType
   ) {
      const price =
         minPrice || maxPrice
            ? {
                 ...(minPrice && { gte: parseFloat(minPrice) }),
                 ...(maxPrice && { lte: parseFloat(maxPrice) })
              }
            : undefined;

      const filter = {
         ...(city && { city }),
         ...(price && { price }),
         ...(propertyType && { property_type: propertyType })
      };

      return this.homeService.getHomes(filter);
   }

   @Get(":id")
   getHomeById(@Param("id") id: string) {
      return this.homeService.getHomeById(id);
   }

   @Post()
   @UseInterceptors(new SnakeCaseInterceptor())
   createHome(@Body() body: CreateHomeDto) {
      return this.homeService.createHome(body);
   }

   @Put(":id")
   updateHome(@Param("id") id: string) {
      return "Updated";
   }

   @Delete(":id")
   deleteHome(@Param("id") id: string) {
      return "Deleted";
   }
}
