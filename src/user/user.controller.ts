import { createUserDto } from './../dtos/create-user.dto';
import { UserService } from './user.service';
import { Body, Controller, Post, Put } from '@nestjs/common';
import { Tokens } from 'src/types/tokens.type';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Post('signup')
    signup(@Body() body: createUserDto): Promise<Tokens> {
        return this.userService.signup(body);
    }

    @Put('update')
    updateUser() {
        return this.userService.updateUser();
    }

    @Put('password')
    changePassword() {
        return this.userService.changePassword();
    }
}
