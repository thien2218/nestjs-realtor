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
import { CreateHomeDto } from "./home.dto";
import { PropertyType } from "@prisma/client";
import { SnakeCaseInterceptor } from "src/utils/interceptors/snakeCase.interceptor";
import { User, JwtPayload } from "src/utils/decorators/user.decorator";
import { Roles } from "src/utils/decorators/roles.decorator";

@Controller("home")
export class HomeController {
   constructor(private homeService: HomeService) {}

   // GET /home
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

   // GET /home/[id]
   @Get(":id")
   @Roles("BUYER")
   getHomeById(@Param("id") id: string, @User() user: JwtPayload) {
      console.log(user);
      return this.homeService.getHomeById(id);
   }

   // POST /home
   @Post()
   @UseInterceptors(new SnakeCaseInterceptor())
   createHome(@Body() body: CreateHomeDto) {
      return this.homeService.createHome(body);
   }

   // PUT /home/[id]
   @Put(":id")
   updateHome(@Param("id") id: string) {
      return "Updated";
   }

   // DELETE /home/[id]
   @Delete(":id")
   deleteHome(@Param("id") id: string) {
      return "Deleted";
   }
}
