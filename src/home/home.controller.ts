import {
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   Post,
   Put,
   Query,
   UseInterceptors
} from "@nestjs/common";
import { HomeService } from "./home.service";
import { HomeResponseDto, UpdateHomeDto } from "./home.dto";
import { PropertyType } from "@prisma/client";
import { SnakeCaseInterceptor } from "src/utils/interceptors/snake-case.interceptor";
import { User, UserPayload } from "src/utils/decorators/user.decorator";
import { Roles } from "src/utils/decorators/roles.decorator";

@Controller("home")
export class HomeController {
   constructor(private homeService: HomeService) {}

   // GET /home?[...queries]
   @Get()
   findAll(
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

      return this.homeService.findAll(filter);
   }

   // GET /home/[id]
   @Get(":id")
   findOneById(@Param("id") id: string) {
      return this.homeService.findOneById(id);
   }

   // POST /home
   @HttpCode(HttpStatus.CREATED)
   @Post()
   @Roles("REALTOR")
   @UseInterceptors(new SnakeCaseInterceptor())
   create(@Body() body: HomeResponseDto, @User() user: UserPayload) {
      return this.homeService.create(body, user.sub);
   }

   // PUT /home/[id]
   @Put(":id")
   @Roles("REALTOR")
   update(
      @Body() body: UpdateHomeDto,
      @Param("id") id: string,
      @User() user: UserPayload
   ) {
      return this.homeService.update(body, id, user.sub);
   }

   // DELETE /home/[id]
   @HttpCode(HttpStatus.NO_CONTENT)
   @Delete(":id")
   @Roles("REALTOR", "ADMIN")
   deleteById(@Param("id") id: string, @User() user: UserPayload) {
      return this.homeService.deleteById(id, user.sub);
   }
}
