import { createUserDto } from './../dtos/create-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Tokens } from 'src/types/tokens.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async signup(body: createUserDto): Promise<Tokens> {
        const hash = await this.hashData(body.password);
        const newUser = await this.prisma.user.create({
            data: {
                fullname: body.fullname,
                email: body.email,
                hash,
            },
        })

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    updateUser() {}

    changePassword() {}

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: process.env.AT_SECRET,
                    expiresIn: process.env.AT_EXPIRESIN
                },
            ),
             this.jwtService.signAsync(
                 {
                    sub: userId,
                    email,
                },
                {
                    secret: process.env.RT_SECRET,
                    expiresIn: process.env.RT_EXPIRESIN
                },
            )
        ]);
        
        return {
            access_token: at,
            refresh_token: rt,
        } 
    }

    async updateRtHash(userId: number, rt: string){
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashRt: hash,
            }
        })
    }

    
}
