import { IsNotEmpty, IsString } from "class-validator";

export class DeleteMessageDto {
   @IsString()
   @IsNotEmpty()
   user_id: string;
}
