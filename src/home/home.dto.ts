import { PropertyType } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
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

export class GetHomeDto {
   @Exclude()
   listed_date: Date;

   @Exclude()
   updated_at: Date;
}

class HomeImage {
   @IsUrl()
   @IsNotEmpty()
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
   cooperates: string[];
}
