import mongoose from 'mongoose';
import User, { IUserLogin, UserModel } from '../models/users';
import { SaltAndHash } from '../utils/saltAndHash';
import { inject, injectable } from 'inversify';
import Types from '../types';
import Logging from '../utils/Logging';

@injectable()
export class UserMappers {
    constructor(@inject(Types.SaltAndHash) private saltAndHash: SaltAndHash) {}

    public async mapRequestToUser(req: any): Promise<UserModel> {
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        const [salt, hash, iterations] =
            this.saltAndHash.hashPassword(password);

        const user: UserModel = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            firstname,
            lastname,
            Authorisation: {
                salt,
                hash,
                iterations,
            },
        });

        return user;
    }

    public mapRequestToUserLogin(req: any): IUserLogin {
        const { email, password } = req.body;

        const user: IUserLogin = {
            email: email,
            password: password,
        };

        return user;
    }
}
