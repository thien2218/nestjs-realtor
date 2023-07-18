import { OmitType } from "@nestjs/swagger";
import { ImageResponseDto } from "./create-image.dto";

export class UpdateImageDto extends OmitType(ImageResponseDto, [
   "home_id"
] as const) {}
