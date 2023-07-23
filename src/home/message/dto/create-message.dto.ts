import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
   @IsString()
   @IsNotEmpty()
   text: string;

   @IsString()
   @IsNotEmpty()
   from: string;

   @IsString()
   @IsNotEmpty()
   to: string;
}
