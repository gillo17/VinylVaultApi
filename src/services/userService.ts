import { UserDao } from '../daos/userDao';
import { IUserLogin, UserAuthorisation, UserModel } from '../models/users';
import { SaltAndHash } from '../utils/saltAndHash';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import Types from '../types';

@injectable()
export class UserService {
    constructor(
        @inject(Types.UserDao) private userDao: UserDao,
        @inject(Types.SaltAndHash) private saltAndHash: SaltAndHash
    ) {}

    public async createuser(user: UserModel) {
        return await this.userDao.createuser(user);
    }

    public async accountLogin(user: IUserLogin) {
        const result: UserAuthorisation = await this.userDao.findUserLogin(
            user
        );

        if (
            this.saltAndHash.vaildatePassword(
                result.Authorisation.hash,
                result.Authorisation.salt,
                result.Authorisation.iterations,
                user.password
            )
        ) {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            const token = jwt.sign(
                { _id: result._id.toString(), email: result.email },
                process.env.JWT_SECRET,
                { expiresIn: '2 days' }
            );

            return [token, user];
        } else {
            return null;
        }
    }
}
