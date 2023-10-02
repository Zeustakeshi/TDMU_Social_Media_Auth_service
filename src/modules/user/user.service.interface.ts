import { RegisterDto } from '@/modules/auth/dtos';
import { UserReponseType } from './types';

export interface IUserService {
    // /**
    //  * @returns {Users[]} all user from database
    //  */
    // getAll(): Promise<Users[]>;

    /**
     * Find user by identity
     * @param identity email or id
     * @returns {Users} user
     * @async
     */
    findUnique(email: string): Promise<UserReponseType>;

    /**
     * Check user existed
     * @param identity email or id
     * @returns {boolean} boolean
     * @async
     */
    isExisted(email: string): Promise<Boolean>;

    /**
     * Save user to database and return new user without password
     * @param {RegisterDto} user register infomation of user
     * @returns {UserReponseType} a user object without password
     */
    register(user: RegisterDto): Promise<UserReponseType>;
}
