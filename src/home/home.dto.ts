import { PropertyType } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import {
   ArrayNotEmpty,
   IsArray,
   IsEnum,
   IsNotEmpty,
   IsPositive,
   IsString,
   ValidateNested
} from "class-validator";

export class GetHomeDto {
   @Expose({ name: "bedroomsCount" })
   bedrooms_count: number;

   @Expose({ name: "bathroomsCount" })
   bathrooms_count: number;

   @Expose({ name: "landSize" })
   land_size: number;

   @Expose({ name: "propertyType" })
   property_type: PropertyType;

   @Exclude()
   listed_date: Date;

   @Exclude()
   updated_at: Date;

   constructor(partial: Partial<GetHomeDto>) {
      Object.assign(this, partial);
   }
}

class HomeImage {
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
   bedroomsCount: number;

   @IsPositive()
   bathroomsCount: number;

   @IsPositive()
   landSize: number;

   @IsPositive()
   price: number;

   @ArrayNotEmpty()
   @ValidateNested({ each: true })
   @Type(() => HomeImage)
   images: HomeImage[];

   @IsArray()
   @IsString({ each: true })
   cooperates: string[];

   @IsEnum(PropertyType)
   propertyType: PropertyType;
}
