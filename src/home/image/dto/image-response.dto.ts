import { Exclude } from "class-transformer";

export class ImageResponseDto {
   @Exclude()
   created_at: Date;

   @Exclude()
   home_id: string;
}
