import {
   ConflictException,
   HttpException,
   Injectable,
   UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GenerateAccessKeyDto, SigninDto, SignupDto } from "./auth.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Prisma, User, UserRole } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { UserInfo } from "src/utils/decorators/user.decorator";

@Injectable()
export class AuthService {
   constructor(
      private readonly prismaService: PrismaService,
      private configService: ConfigService
   ) {}

   private generateJwt(user: User) {
      const userInfo: UserInfo = {
         id: user.id,
         name: user.name,
         email: user.email
      };

      return {
         token: jwt.sign(
            userInfo,
            this.configService.get("JWT_SECRET") as string,
            {
               expiresIn: 604800
            }
         )
      };
   }

   private async checkAccessKey(
      userRole: UserRole,
      email: string,
      accessKey: string | undefined
   ) {
      if (userRole != "BUYER") {
         if (!accessKey) {
            throw new UnauthorizedException();
         }

         const accessKeyStr = `${email}-${userRole}-${this.configService.get(
            "ACCESS_KEY_SECRET"
         )}`;
         const isValidAccessKey = await bcrypt.compare(accessKeyStr, accessKey);

         if (!isValidAccessKey) {
            throw new UnauthorizedException();
         }
      }
   }

   async signup(
      { accessKey, password, ...signup }: SignupDto,
      userRole: UserRole
   ): Promise<{ token: string }> {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.checkAccessKey(userRole, signup.email, accessKey);

      try {
         const user = await this.prismaService.user.create({
            data: {
               ...signup,
               password: hashedPassword,
               role: userRole
            }
         });

         return this.generateJwt(user);
      } catch (err) {
         if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
         ) {
            throw new ConflictException(
               "An account with this email has already existed"
            );
         } else {
            throw new ConflictException(
               "An unexpected error has occured. Please try again later"
            );
         }
      }
   }

   async signin({ email, password }: SigninDto): Promise<{ token: string }> {
      const user = await this.prismaService.user.findUnique({
         where: {
            email
         }
      });

      if (!user) {
         throw new HttpException("Incorrect email or password", 400);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
         throw new HttpException("Incorrect email or password", 400);
      }

      return this.generateJwt(user);
   }

   generateAccessKey({
      email,
      userRole
   }: GenerateAccessKeyDto): Promise<string> {
      const accessStr = `${email}-${userRole}-${this.configService.get(
         "ACCESS_KEY_SECRET"
      )}`;

      return bcrypt.hash(accessStr, 10);
   }
}
