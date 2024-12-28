import { describe, expect, test, jest } from '@jest/globals';
import { SaltAndHash } from '../../../src/utils/saltAndHash';
import { UserDao } from '../../../src/daos/userDao';
import { UserService } from '../../../src/services/userService';
import {
    UserModel,
    UserAuthorisation,
    IUserLogin,
} from '../../../src/models/users';
import jwt from 'jsonwebtoken';
import { iuserLogin, testUser, testUserAuthorisation } from '../testTypes';

describe('User Service Tests', () => {
    const saltAndHash = new SaltAndHash();
    const userDao = new UserDao();
    const userService = new UserService(userDao, saltAndHash);

    test('createuser is called when a user is created', async () => {
        const createUserSpy = jest
            .spyOn(userDao, 'createuser')
            .mockResolvedValue(undefined);

        const user = await userService.createuser(testUser);

        expect(createUserSpy).toHaveBeenCalledWith(testUser);
        expect(user).toBe(undefined);
    });

    test('Error is returned if createuser is called and a user already exists', async () => {
        const createUserSpy = jest
            .spyOn(userDao, 'createuser')
            .mockResolvedValue('A user with this email already exists');

        const user = await userService.createuser(testUser);

        expect(createUserSpy).toHaveBeenCalledWith(testUser);
        expect(user).toBe('A user with this email already exists');
    });

    test('findUserLogin and vaildatePassword is called when a user logs in', async () => {
        process.env.JWT_SECRET = 'testsecret';

        const createUserSpy = jest
            .spyOn(userDao, 'findUserLogin')
            .mockResolvedValue(testUserAuthorisation);

        const createHashSpy = jest
            .spyOn(saltAndHash, 'vaildatePassword')
            .mockReturnValue(true);

        jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken' as any);

        const user = await userService.accountLogin(iuserLogin);

        expect(createUserSpy).toHaveBeenCalledWith(iuserLogin);
        expect(createHashSpy).toHaveBeenCalledWith(
            testUserAuthorisation.Authorisation.hash,
            testUserAuthorisation.Authorisation.salt,
            testUserAuthorisation.Authorisation.iterations,
            iuserLogin.password
        );

        expect(user).toContain(iuserLogin);
    });
});
