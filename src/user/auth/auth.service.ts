import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignupDto } from "./auth.dto";
import * as bcrypt from "bcrypt";
import { Prisma, User, UserRole } from "@prisma/client";

@Injectable()
export class AuthService {
   constructor(private readonly prismaService: PrismaService) {}

   async createUser(signup: SignupDto): Promise<User | undefined> {
      const hashedPassword = await bcrypt.hash(signup.password, 12);

      try {
         const user = await this.prismaService.user.create({
            data: {
               ...signup,
               password: hashedPassword,
               role: UserRole.BUYER
            }
         });

         return user;
      } catch (err) {
         if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
         ) {
            throw new ConflictException(
               "An account with this email has already existed."
            );
         } else {
            throw new ConflictException(
               "An unexpected error has occured. Please try again later."
            );
         }
      }
   }
}
