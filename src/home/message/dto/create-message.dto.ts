import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
   @IsString()
   @IsNotEmpty()
   message: string;

   @IsString()
   @IsNotEmpty()
   from: string;

   @IsString()
   @IsNotEmpty()
   to: string;

   @IsString()
   @IsNotEmpty()
   home_id: string;
}
