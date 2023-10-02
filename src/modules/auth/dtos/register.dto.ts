import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    username: string;
    @IsNotEmpty()
    @IsString()
    @Length(6)
    password: string;

    @IsNotEmpty()
    birthday: string;
    @IsEnum(Gender)
    gender: string;
}
