import { RtGuard } from './../common/guards/rt.guard';
import { AtGuard } from './../common/guards/at.guard';
import { SignInDto } from './../dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { Tokens } from 'src/types/tokens.type';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // @Post('signup')
    // signup() {
    //     return this.authService.signup();
    // }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() body: SignInDto): Promise<Tokens> {
        return this.authService.signin(body);
    }

    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request) {
        const user = req.user;
        return this.authService.logout(user['id']);
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request) {
        const user = req.user;
        return this.authService.refreshTokens(user['id'], user['refreshToken']);
    }
}