import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6)
    password: string;
}
