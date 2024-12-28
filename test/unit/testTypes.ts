import {
    IUserLogin,
    UserAuthorisation,
    UserModel,
} from '../../src/models/users';

const testUser: UserModel = {
    email: 'test@test.com',
    firstname: 'test',
    lastname: 'test',
    Authorisation: {
        salt: 'salt',
        hash: 'hash',
        iterations: 2,
    },
};

const testUserAuthorisation: UserAuthorisation = {
    _id: '1',
    email: 'test@test.com',
    firstname: 'test',
    lastname: 'test',
    Authorisation: {
        salt: 'salt',
        hash: 'hash',
        iterations: 2,
    },
};

const iuserLogin: IUserLogin = {
    email: 'test@test.com',
    password: 'password',
};

export { testUser, testUserAuthorisation, iuserLogin };
