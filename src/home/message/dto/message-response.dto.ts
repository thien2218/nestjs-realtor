import { Exclude, Type } from "class-transformer";
import { UserInfo } from "src/home/dto/home-response.dto";

export class MessageResponseDto {
   @Exclude()
   from: string;

   @Exclude()
   to: string;

   @Exclude()
   home_id: string;

   @Exclude()
   created_at: string;

   @Type(() => UserInfo)
   sender: Partial<UserInfo>;

   @Type(() => UserInfo)
   receiver: Partial<UserInfo>;
}
