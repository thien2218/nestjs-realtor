import {
   IsEmail,
   IsNotEmpty,
   IsString,
   Matches,
   MaxLength,
   MinLength
} from "class-validator";

export class SignupDto {
   @IsString()
   @IsNotEmpty()
   name: string;

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
}
