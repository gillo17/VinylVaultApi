import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface UserModel {
    email: string;
    firstname: string;
    lastname: string;
    Authorisation: {
        salt: string;
        hash: string;
        iterations: number;
    };
}

export interface UserAuthorisation {
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    Authorisation: {
        salt: string;
        hash: string;
        iterations: number;
    };
}

export interface IUserModel extends UserModel, IUserLogin, Document {}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        Authorisation: {
            salt: { type: String, required: true },
            hash: { type: String, required: true },
            iterations: { type: Number, required: true },
        },
    },

    {
        versionKey: false,
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);
