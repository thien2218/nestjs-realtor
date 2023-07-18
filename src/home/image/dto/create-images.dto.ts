import { OmitType } from "@nestjs/swagger";
import { CreateImageDto } from "./create-image.dto";
import { ArrayNotEmpty, IsUrl } from "class-validator";

export class CreateImagesDto extends OmitType(CreateImageDto, [
   "url"
] as const) {
   @ArrayNotEmpty()
   @IsUrl({}, { each: true })
   urls: Array<string>;
}
