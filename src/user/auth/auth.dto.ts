import { UserRole } from "@prisma/client";
import {
   IsEmail,
   IsEnum,
   IsNotEmpty,
   IsOptional,
   IsString,
   Matches,
   MaxLength,
   MinLength
} from "class-validator";

export class SignupDto {
   @IsString()
   @IsNotEmpty()
   first_name: string;

   @IsString()
   @IsNotEmpty()
   last_name: string;

   @Matches(/^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
   phone: string;

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsNotEmpty()
   @MinLength(6)
   @MaxLength(20)
   password: string;

   @IsString()
   @IsOptional()
   productKey?: string;
}

export class SigninDto {
   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsNotEmpty()
   @MinLength(6)
   @MaxLength(20)
   password: string;
}

export class GenerateProductKeyDto {
   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsEnum(UserRole)
   userRole: string;
}
