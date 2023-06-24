import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignupDto } from "./auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
   constructor(private readonly prismaService: PrismaService) {}

   async createUser(signup: SignupDto) {
      const hashedPassword = bcrypt.hash(signup.password, 12);
   }
}
