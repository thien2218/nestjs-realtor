import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateImageDto {
   @IsUrl()
   url: string;
}
