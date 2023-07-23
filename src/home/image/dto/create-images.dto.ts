import { ArrayNotEmpty, IsUrl } from "class-validator";

export class CreateImagesDto {
   @ArrayNotEmpty()
   @IsUrl({}, { each: true })
   urls: Array<string>;
}
