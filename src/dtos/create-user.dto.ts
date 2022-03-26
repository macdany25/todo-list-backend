import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsEqualTo } from "src/common/decorators/match.decorator";

export class createUserDto {
    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsEqualTo<createUserDto>('password')
    confirm_password: string;
}