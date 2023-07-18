import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class ImageResponseDto {
   @IsUrl()
   url: string;

   @IsString()
   @IsNotEmpty()
   home_id: string;
}
