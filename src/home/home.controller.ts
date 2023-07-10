import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   ParseFloatPipe,
   Post,
   Put,
   Query,
   UsePipes
} from "@nestjs/common";
import { HomeService } from "./home.service";
import { CreateHomeDto, GetHomeDto } from "./home.dto";
import { PropertyType } from "@prisma/client";
import { SnakeCasePipe } from "src/pipes/snakeCase.pipe";

@Controller("home")
export class HomeController {
   constructor(private readonly homeService: HomeService) {}

   @Get()
   getHomes(
      @Query("city") city?: string,
      @Query("minPrice") minPrice?: string,
      @Query("maxPrice") maxPrice?: string,
      @Query("propType") propertyType?: PropertyType
   ): Promise<GetHomeDto[]> {
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
   @UsePipes(new SnakeCasePipe())
   createHome(@Body() body: CreateHomeDto) {
      console.log(body);
      return "Created";
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
