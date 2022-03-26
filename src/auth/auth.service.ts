import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';
import { SignInDto } from './../dtos/sign-in.dto';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Tokens } from 'src/types/tokens.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private userService: UserService,
        ) {}
    
    // signup() {}

    async signin(body: SignInDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email,
            }
        });

        if (!user) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);

        const isMatch = await bcrypt.compare(body.password, user.hash);
        if (!isMatch) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

        const tokens = await this.userService.getTokens(user.id, user.email);
        await this.userService.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: number) {
        // const user = await this.prisma.user.findUnique({
        //     where: {
        //         id: userId,
        //     }
        // })
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashRt: {
                    not: null,
                }
            },
            data: {
                hashRt: null,
            }
        });
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');

        const rtMatch = await bcrypt.compare(rt, user.hashRt);
        if (!rtMatch) throw new ForbiddenException('Access Denied');

        const tokens = await this.userService.getTokens(user.id, user.email);
        await this.userService.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }
}
