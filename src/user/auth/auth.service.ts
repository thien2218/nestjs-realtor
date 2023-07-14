import {
   ConflictException,
   HttpException,
   Injectable,
   UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GenerateProductKeyDto, SigninDto, SignupDto } from "./auth.dto";
import * as bcrypt from "bcrypt";
import { Prisma, User, UserRole } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { UserInfo } from "src/utils/decorators/user.decorator";
import { JwtService } from "@nestjs/jwt";

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

@Injectable()
export class AuthService {
   constructor(
      private prismaService: PrismaService,
      private configService: ConfigService,
      private jwtService: JwtService
   ) {}

   async signup(
      { productKey, password, ...signup }: SignupDto,
      userRole: UserRole
   ): Promise<Tokens> {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.checkProductKey(userRole, signup.email, productKey);

      try {
         const user = await this.prismaService.user.create({
            data: {
               ...signup,
               hashed_password: hashedPassword,
               role: userRole
            }
         });

         const tokens = await this.generateJwt(user);
         await this.updateRefreshToken(user.id, tokens.refreshToken);
         return tokens;
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

   async signin({ email, password }: SigninDto): Promise<Tokens> {
      const user = await this.prismaService.user.findUnique({
         where: {
            email
         }
      });

      if (!user) {
         throw new HttpException("Incorrect email or password", 400);
      }

      const isValidPassword = await bcrypt.compare(
         password,
         user.hashed_password
      );

      if (!isValidPassword) {
         throw new HttpException("Incorrect email or password", 400);
      }

      const tokens = await this.generateJwt(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
   }

   async generateProductKey({
      email,
      userRole
   }: GenerateProductKeyDto): Promise<string> {
      const accessStr = `${email}-${userRole}-${this.configService.get(
         "PRODUCT_KEY_SECRET"
      )}`;

      return bcrypt.hash(accessStr, 10);
   }

   private async generateJwt(user: User) {
      const userInfo: UserInfo = {
         id: user.id,
         name: user.name,
         email: user.email
      };

      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(userInfo),
         this.jwtService.signAsync(userInfo, {
            secret: this.configService.get("REFRESH_TOKEN_SECRET") as string,
            expiresIn: 60 * 60 * 24 * 7
         })
      ]);

      return { accessToken, refreshToken };
   }

   private async updateRefreshToken(userId: string, refreshToken: string) {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.prismaService.user.update({
         where: { id: userId },
         data: { refresh_token: hashedRefreshToken }
      });
   }

   private async checkProductKey(
      userRole: UserRole,
      email: string,
      productKey: string | undefined
   ) {
      if (userRole != "BUYER") {
         if (!productKey) {
            throw new UnauthorizedException();
         }

         const productKeyStr = `${email}-${userRole}-${this.configService.get(
            "PRODUCT_KEY_SECRET"
         )}`;

         const isValidProductKey = await bcrypt.compare(
            productKeyStr,
            productKey
         );

         if (!isValidProductKey) {
            throw new UnauthorizedException();
         }
      }
   }
}
