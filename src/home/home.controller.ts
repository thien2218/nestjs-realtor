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
import { HomeResponseDto, UpdateHomeDto } from "./home.dto";
import { PropertyType } from "@prisma/client";
import { SnakeCaseInterceptor } from "src/utils/interceptors/snakeCase.interceptor";
import { User, UserPayload } from "src/utils/decorators/user.decorator";
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
   getHomeById(@Param("id") id: string) {
      return this.homeService.getHomeById(id);
   }

   // POST /home
   @Post()
   @Roles("REALTOR")
   @UseInterceptors(new SnakeCaseInterceptor())
   createHome(@Body() body: HomeResponseDto, @User() user: UserPayload) {
      return this.homeService.createHome(body, user.sub);
   }

   // PUT /home/[id]
   @Put(":id")
   @Roles("REALTOR")
   updateHome(
      @Body() body: UpdateHomeDto,
      @Param("id") id: string,
      @User() user: UserPayload
   ) {
      return this.homeService.updateHome(body, id, user.sub);
   }

   // DELETE /home/[id]
   @Delete(":id")
   @Roles("REALTOR", "ADMIN")
   deleteHome(@Param("id") id: string, @User() user: UserPayload) {
      return this.homeService.deleteHome(id, user.sub);
   }
}
