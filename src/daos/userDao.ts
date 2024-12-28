import { MongoServerError } from 'mongodb';
import { IUserLogin, UserAuthorisation, UserModel } from '../models/users';
import User from '../models/users';
import { injectable } from 'inversify';

@injectable()
export class UserDao {
    public async createuser(user: UserModel) {
        const userMdbObj = new User(user);

        try {
            await userMdbObj.save();
        } catch (error) {
            if (error instanceof MongoServerError && error.code === 11000) {
                return 'A user with this email already exists';
            } else {
                throw new Error(String(error));
            }
        }
    }

    public async findUserLogin(user: IUserLogin): Promise<UserAuthorisation> {
        const result: UserAuthorisation = (await User.findOne({
            email: user.email,
        })) as UserAuthorisation;

        if (result) {
            return result;
        } else {
            throw new Error('User not Found');
        }
    }
}
