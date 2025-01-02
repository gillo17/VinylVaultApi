import { describe, expect, test, jest } from '@jest/globals';
import { CollectionsMapper } from '../../../src/mappers/collectionsMapper';

describe('Collection Mapper Tests', () => {
    const collectionsMapper = new CollectionsMapper();

    const testRequest = {
        body: {
            collectionName: "Test2",
            collectionDescription: "test description",
            user: {
                _id: "1"
            }
        },
    };

    test('Map a Request to Collecion Interface', async () => {
        const collection = await collectionsMapper.mapRequestToCollection(testRequest);

        expect(collection.collectionName).toBe(testRequest.body.collectionName);
        expect(collection.description).toBe(testRequest.body.collectionDescription);
        expect(collection.userID).toBe(testRequest.body.user._id);
        expect(collection.vinyls).toStrictEqual([]);
    });
});
