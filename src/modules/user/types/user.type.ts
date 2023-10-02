export enum UserGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}
export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    birdthDate: string;
    gender: UserGender;
    imageUrl: string;
};
