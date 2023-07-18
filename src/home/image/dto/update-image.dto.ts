import { OmitType } from "@nestjs/swagger";
import { CreateImageDto } from "./create-image.dto";

export class UpdateImageDto extends OmitType(CreateImageDto, [
   "home_id"
] as const) {}
