import { OmitType } from "@nestjs/swagger";
import { ImageResponseDto } from "./create-image.dto";
import { ArrayNotEmpty, IsUrl } from "class-validator";

export class CreateImagesDto extends OmitType(ImageResponseDto, [
   "url"
] as const) {
   @ArrayNotEmpty()
   @IsUrl({}, { each: true })
   urls: Array<string>;
}
