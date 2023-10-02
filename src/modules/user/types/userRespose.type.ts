import { User } from './user.type';

export type UserReponseType = Omit<User, 'passsword'>;
