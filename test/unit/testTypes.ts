import Collection from '../../src/models/collections';
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

const testCollection = new Collection({
        _id: 'testId',
        collectionName: 'testCollectionName',
        description: 'testDescription',
        vinyls: [],
        userID: 'testUserID'
    });

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

export { testUser, testUserAuthorisation, iuserLogin, testCollection };
