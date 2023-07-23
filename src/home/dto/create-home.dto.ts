import { PropertyType } from "@prisma/client";
import { Type } from "class-transformer";
import {
   ArrayNotEmpty,
   IsArray,
   IsEnum,
   IsNotEmpty,
   IsPositive,
   IsString,
   IsUrl,
   ValidateNested
} from "class-validator";

class HomeImage {
   @IsNotEmpty()
   @IsUrl()
   url: string;
}

export class CreateHomeDto {
   @IsString()
   @IsNotEmpty()
   title: string;

   @IsString()
   @IsNotEmpty()
   address: string;

   @IsString()
   @IsNotEmpty()
   city: string;

   @IsPositive()
   bedrooms_count: number;

   @IsPositive()
   bathrooms_count: number;

   @IsPositive()
   land_size: number;

   @IsPositive()
   price: number;

   @IsEnum(PropertyType)
   property_type: PropertyType;

   @ArrayNotEmpty()
   @ValidateNested({ each: true })
   @Type(() => HomeImage)
   images: HomeImage[];

   @IsArray()
   @IsString({ each: true })
   cooperators: string[];
}
