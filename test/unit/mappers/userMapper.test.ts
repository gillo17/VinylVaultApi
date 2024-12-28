import { describe, expect, test, jest } from '@jest/globals';
import { UserMappers } from '../../../src/mappers/userMappers';
import { SaltAndHash } from '../../../src/utils/saltAndHash';

describe('User Mapper Tests', () => {
    const saltAndHash = new SaltAndHash(); // Create an instance of SaltAndHash
    const userMapper = new UserMappers(saltAndHash);

    const testRequest = {
        body: {
            email: 'test@test.com',
            password: 'password',
            firstname: 'test',
            lastname: 'test',
        },
    };

    test('Map a Request to User Create Interface', async () => {
        const user = await userMapper.mapRequestToUser(testRequest);

        expect(user.email).toBe(testRequest.body.email);
        expect(user.firstname).toBe(testRequest.body.firstname);
        expect(user.lastname).toBe(testRequest.body.lastname);
    });

    test('SaltAndHash hashPassword method is called', async () => {
        const hashPasswordSpy = jest
            .spyOn(saltAndHash, 'hashPassword')
            .mockReturnValue(['hashedPassword']);

        const user = await userMapper.mapRequestToUser(testRequest);

        expect(hashPasswordSpy).toHaveBeenCalledWith(testRequest.body.password);
        expect(user.Authorisation.salt).toBe('hashedPassword');
    });
});
