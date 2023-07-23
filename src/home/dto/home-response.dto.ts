import { Exclude, Type } from "class-transformer";

export class UserInfo {
   id: string;
   first_name: string;
   last_name: string;
   phone: string;
   email: string;
}

export class HomeResponseDto {
   @Exclude()
   listed_date: Date;

   @Exclude()
   updated_at: Date;

   @Type(() => UserInfo)
   realtor: Partial<UserInfo>;
}
