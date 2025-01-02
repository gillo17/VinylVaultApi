import { describe, expect, test, jest } from '@jest/globals';
import { CollectionsDao } from '../../../src/daos/collectionsDao';
import { UserModel } from '../../../src/models/users';
import Collection from '../../../src/models/collections';
import { MongoServerError } from 'mongodb';
import { testCollection } from '../testTypes';

describe('Collection Dao Tests', () => {
    const collectionsDao = new CollectionsDao();

    test('Create a collection successfully', async () => {
        jest.spyOn(Collection.prototype, 'save').mockResolvedValueOnce(testCollection);

        const result = await collectionsDao.createCollection(testCollection);

        expect(result).toBeUndefined();
    });

    test('Create a collection with existing email', async () => {
        const error = new MongoServerError({
            message: 'Duplicate key error',
            code: 11000,
        });
        jest.spyOn(Collection.prototype, 'save').mockRejectedValueOnce(error);

        const result = await collectionsDao.createCollection(testCollection);

        expect(result).toBe('A collection with this name already exists');
    });

    test('Create a collection with other error', async () => {
        const error = new Error('Some other error');
        jest.spyOn(Collection.prototype, 'save').mockRejectedValueOnce(error);

        await expect(collectionsDao.createCollection(testCollection)).rejects.toThrow(
            'Some other error'
        );
    });
});
