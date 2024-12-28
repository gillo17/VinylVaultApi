import { describe, expect, test, jest } from '@jest/globals';
import { UserDao } from '../../../src/daos/userDao';
import { UserModel } from '../../../src/models/users';
import User from '../../../src/models/users';
import { MongoServerError } from 'mongodb';
import { testUser } from '../testTypes';

describe('User Dao Tests', () => {
    const userDao = new UserDao();

    test('Create a user account', async () => {});
    describe('User Dao Tests', () => {
        const userDao = new UserDao();

        test('Create a user account successfully', async () => {
            jest.spyOn(User.prototype, 'save').mockResolvedValueOnce(testUser);

            const result = await userDao.createuser(testUser);

            expect(result).toBeUndefined();
        });

        test('Create a user account with existing email', async () => {
            const error = new MongoServerError({
                message: 'Duplicate key error',
                code: 11000,
            });
            jest.spyOn(User.prototype, 'save').mockRejectedValueOnce(error);

            const result = await userDao.createuser(testUser);

            expect(result).toBe('A user with this email already exists');
        });

        test('Create a user account with other error', async () => {
            const error = new Error('Some other error');
            jest.spyOn(User.prototype, 'save').mockRejectedValueOnce(error);

            await expect(userDao.createuser(testUser)).rejects.toThrow(
                'Some other error'
            );
        });
    });
});
