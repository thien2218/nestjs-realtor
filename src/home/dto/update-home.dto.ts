import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateHomeDto } from "./create-home.dto";

export class UpdateHomeDto extends PartialType(
   OmitType(CreateHomeDto, ["images"] as const)
) {}
